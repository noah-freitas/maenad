const serviceWorkerPath = 'service-worker.js';

export default {
    register,
    serviceWorkerPath
};

// register :: String -> Promise<ServiceWorkerRegistration>
function register(path = serviceWorkerPath, scope = '/') {
    return navigator.serviceWorker.register(path, { scope });
}
