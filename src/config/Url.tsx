let _BACKEND_URL = "http://localhost/backend"
let _FILESERVER_URL = "http://localhost/backend" 

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    // production code
    _BACKEND_URL = "https://cuahangnhuquynh.com/backend"
    _FILESERVER_URL = 'https://cuahangnhuquynh.com/backend'
}

export const HOST_URL = _BACKEND_URL;
export const FILESERVER_URL = _FILESERVER_URL;