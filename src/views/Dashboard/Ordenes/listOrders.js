import { loading, userStore, page, size, monto, stateOrder, dateStart, dateEnd, ordenes, pagination } from './index.vue';

export const listOrders = async () => {
loading.value = true;
const result = await userStore.listOrders({
page: page.value,
size: size.value,
monto: monto.value,
state: stateOrder.value,
startDate: dateStart.value !== null ? undefined : dateStart.value,
endDate: dateEnd.value
});
if (result.success) {
ordenes.value = result.data.rows;
pagination.value = Math.ceil(result.data.count / size.value);
loading.value = false;
}
};
