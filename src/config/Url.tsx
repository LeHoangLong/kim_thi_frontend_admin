let _BACKEND_URL = "http://kim_thi_backend_1/backend"
let _FILESERVER_URL = "http://localhost/backend" 

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    // production code
    _BACKEND_URL = "https://kim-thi-backend-rfqj7mlw2q-as.a.run.app/backend"
    _FILESERVER_URL = 'https://kim-thi-backend-rfqj7mlw2q-as.a.run.app/backend'
}

export const HOST_URL = _BACKEND_URL;
export const FILESERVER_URL = _FILESERVER_URL;