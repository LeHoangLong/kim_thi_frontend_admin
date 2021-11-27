let _BACKEND_URL = "http://kim_thi_backend_1/backend"
if (process.env.CLOUD === 'GOOGLE') {
    _BACKEND_URL = "https://kim-thi-backend-rfqj7mlw2q-as.a.run.app/backend"
}
export const HOST_URL = _BACKEND_URL;

let _FILESERVER_URL = "http://localhost/backend" 
if (process.env.CLOUD === 'GOOGLE') {
    _FILESERVER_URL = 'https://kim-thi-backend-rfqj7mlw2q-as.a.run.app/backend'
}
export const FILESERVER_URL = _FILESERVER_URL;