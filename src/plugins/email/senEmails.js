export function emailRegistro (value) {
  let email = `
    <table style="width: 600px;font-family: sans-serif;background:white" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <th colspan="2" style="background: #135f82;padding: 25px;">
          <img src="https://mrcashassets.s3.amazonaws.com/logo1.png" alt="">
        </th>
      </tr>
      <tr style="font-weight: bold;height: 120px;font-size: 35px;text-align: center;color: #135f82;">
        <td colspan="2">Bienvenido ${value.nombres}</td>
      </tr>
      <tr>
        <td style="width: 50%;">
          <img src="https://mrcashassets.s3.amazonaws.com/Recurso+7.png" alt="">
        </td>
        <td style="width: 50%;">
          <div style="display: grid;justify-items: center;text-align: center;">
            <a style="background: #03acad;color: #fff;width: 220px;border-radius: 10px;text-decoration: none;padding: 20px 40px;" href="http://54.208.93.12/login">INICIAR SESIÓN</a>
            <p style="font-size: 19px;">Coloque sus credenciales
              registradas para terminar su proceso de registro.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="height: 40px;"></td>
      </tr>
      <tr></tr>
      <tr></tr>
      <tr>
        <td colspan="2">
          <div style="background: #135f82;height:36px"></div>
        </td>
      </tr>
  </table>`
  return email
}


export function userValidate (value) {
  let email = `
  <table style="max-width: 600px;font-family: sans-serif;" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td>
        <img width="100%" src="https://mrcashassets.s3.amazonaws.com/cuenta-revisado.png" alt="">
      </td>
    </tr>
  </table>`
  return email
}


export function userCanceled (value) {
  let email = `
  <table align="center" style="max-width:600px;margin-left:auto;margin-right:auto;font-family: sans-serif;" width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td>
        <img width="100%" src="https://mrcashassets.s3.amazonaws.com/cuenta-error.png" alt="">
      </td>
    </tr>
  </table>`
  return email
}

export function orderFallida (value) {
  let email = `
  <table align="center" style="max-width:600px;margin-left:auto;margin-right:auto;font-family: sans-serif;" width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td>
        <img width="100%" src="https://mrcashassets.s3.amazonaws.com/orden-fallida.png" alt="">
      </td>
    </tr>
  </table>`
  return email
}


export function orderGenerada (value) {
  let email = `
  <table style="max-width: 600px;font-family: sans-serif;" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <th colspan="2" style="background: #03acad;padding: 25px;">
        <img src="https://mrcashassets.s3.amazonaws.com/logo2.png" alt="">
      </th>
    </tr>
    <tr style="height: 120px;max-width: 580px;text-align: center;background-color: #fff ;">
      <td colspan="2">
        <h2 style="color: #03acad;font-size: 22px;">Nueva orden generada</h2>
        <p style="color: #707070;font-size: 16px;">Se ha creado una nueva orden con número <br>
          de transacción ${value.codigo}</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom: 30px;background-color: #fff ;">
        <table width="100%">
          <tr>
            <td>
              <div>
                <center>
                  <img src="https://mrcashassets.s3.amazonaws.com/Recurso+14.png" alt="">
                </center>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center">
        <center>
          <table style="min-width: 580px;background: #f0f0f0;padding: 25px 0;max-width: 100%">
            <tr>
              <td align="center">
                <center>
                  <table width="100%">
                    <tr>
                      <td align="center">
                        <div style="width: 400px;border: 1px solid #eeeeee;border-radius: 15px;background: #fff">
                          <div style="border-radius: 15px 15px 0px 0 !important;background: #03acad;padding: 20px 0;color: white;">
                            <center>
                              <table style="width: 100%;">
                                <tr>
                                  <td align="center" style="color: #fff;">Transaccion: <b ">${value.codigo}</b></td>
                                  <td align="center" style="color: #fff;">${value.date}</td>
                                </tr>
                              </table>
                            </center>
                          </div>
                          <div>
                            <center>
                              <table>
                                <tr>
                                  <td align="center" style="font-size: 25px;padding-top: 25px;"><b>S/${value.receive}</b></td>
                                </tr>
                                <tr>
                                  <td align="center" style="font-size: 12px;">Monto de devolución</td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Monto Enviado</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px;"><b>S/${value.send}</b></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Banco Origen</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px">
                                          <img width="80" class="mr-3" src="${value.url}/icons/${value.iconBank}-logo.png" />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Comisión (${value.comisionUser}%)</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px;"><b>S/${value.comision}</b></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Banco Destino</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px">
                                          <img width="80" class="mr-3" src="${value.url}/icons/${value.iconBankSend.bank.icon}-logo.png" />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">N° de cuenta</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px;"><b>${value.iconBankSend.number_account}</b></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 50px;">
                                    <div style="max-width: 200px;background: #dbd200;height: 30px;padding-top: 15px;margin-bottom: 20px;border-radius: 15px;color: #fff;">Pendiente</div>
                                  </td>
                                </tr>
                              </table>
                            </center>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
        </center>
      </td>
    </tr>
    <tr></tr>
    <tr></tr>
    <tr>
      <td>
        <div style="background: #03acad;height:36px"></div>
      </td>
    </tr>
  </table>`
  return email
}


export function ordenAprobada (value) {
  let email =  `
    <table style="max-width: 600px;font-family: sans-serif;" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <th colspan="2" style="background: #03acad;padding: 25px;">
        <img src="https://mrcashassets.s3.amazonaws.com/logo2.png" alt="">
      </th>
    </tr>
    <tr style="height: auto;max-width: 580px;text-align: center;background-color: #fff ;">
      <td colspan="2">
        <h2 style="color: #03acad;font-size: 25px;padding-top: 25px;">¡Se realizó su depósito!</h2>
      </td>
    </tr>
    <tr>
      <td align="center">
        <center>
          <table style="min-width: 580px;padding-bottom: 25px;max-width: 100%;z-index: 1;position: relative;">
            <tr>
              <td align="center">
                <center>
                  <table width="100%">
                    <tr>
                      <td align="center">
                        <div style="width: 400px;background: #fff;border: 1px solid #eeeeee;border-radius: 15px;">
                          <div style="border-radius: 15px 15px 0px 0 !important;background: #03acad;padding: 20px 0;color: white;">
                            <center>
                              <table style="width: 100%;">
                                <tr>
                                  <td align="center" style="color: #fff;">Transaccion: <b ">${value.codigo}</b></td>
                                  <td align="center" style="color: #fff;">${value.create_date}</td>
                                </tr>
                              </table>
                            </center>
                          </div>
                          <div>
                            <center>
                              <table>
                                <tr>
                                  <td align="center" style="font-size: 25px;padding-top: 25px;"><b>S/${value.monto_receive}</b></td>
                                </tr>
                                <tr>
                                  <td align="center" style="font-size: 12px;">Monto de devolución</td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Monto Enviado</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px;"><b>S/${value.monto_send}</b></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Banco Origen</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px">
                                          <img width="80" class="mr-3" src="${value.url}/icons/${value.bank.icon}-logo.png" />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Comisión (${value.percentage}%)</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px;"><b>S/${value.monto_comision}</b></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">Banco Destino</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px">
                                          <img width="80" class="mr-3" src="${value.url}/icons/${value.bankUser.icon}-logo.png" />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    <table width="100%">
                                      <tr>
                                        <td align="center" style="font-size: 14px;color: #707070;">N° de cuenta</td>
                                      </tr>
                                      <tr>
                                        <td align="center" style="font-size: 14px;"><b>${value.number_account}</b></td>
                                      </tr>
                                    </table>
                                  </td>
                                  <td align="center" style="padding-top: 25px;" width="50%">
                                    
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <center>
                              <table width="100%">
                                <tr>
                                  <td align="center" style="padding-top: 50px;">
                                    <div style="max-width: 200px;background: #dbd200;height: 30px;padding-top: 15px;margin-bottom: 20px;border-radius: 15px;color: #fff;">Pendiente</div>
                                  </td>
                                </tr>
                              </table>
                            </center>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
        </center>
      </td>
    </tr>
    <tr>
      <td>
        <table width="100%">
          <tr>
            <th>
              <img style="margin-top: -130px;" src="https://mrcashassets.s3.amazonaws.com/agradecimiento.png" alt="">
            </th>
          </tr>
        </table>
      </td>
    </tr>
    <tr></tr>
    <tr>
      <td>
        <div style="background: #03acad;height:36px"></div>
      </td>
    </tr>
  </table>`

  return email
}