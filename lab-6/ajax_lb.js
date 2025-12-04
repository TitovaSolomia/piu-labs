class Ajax {
    constructor(options = {}) {
        this.options = {
            baseURL: '',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000,
            ...options,
        };
    }

    handleError(response) {
        if (!response.ok) {
            throw new Error(
                `HTTP Błąd: ${response.status} - ${response.statusText}`
            );
        }
        return response.json();
    }

    async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const { timeout } = options;
        const signal = controller.signal;

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...options, signal });
            return await this.handleError(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Czas oczekiwania na odpowiedź przekroczony');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async get(url, options = {}) {
        const { baseURL, headers, timeout } = this.options;
        const fetchOptions = {
            method: 'GET',
            headers: { ...headers, ...options.headers },
            timeout,
        };
        const fullUrl = baseURL + url;
        return await this.fetchWithTimeout(fullUrl, fetchOptions);
    }

    async post(url, data, options = {}) {
        const { baseURL, headers, timeout } = this.options;
        const fetchOptions = {
            method: 'POST',
            headers: { ...headers, ...options.headers },
            body: JSON.stringify(data),
            timeout,
        };
        const fullUrl = baseURL + url;
        return await this.fetchWithTimeout(fullUrl, fetchOptions);
    }

    async put(url, data, options = {}) {
        const { baseURL, headers, timeout } = this.options;
        const fetchOptions = {
            method: 'PUT',
            headers: { ...headers, ...options.headers },
            body: JSON.stringify(data),
            timeout,
        };
        const fullUrl = baseURL + url;
        return await this.fetchWithTimeout(fullUrl, fetchOptions);
    }

    async delete(url, options = {}) {
        const { baseURL, headers, timeout } = this.options;
        const fetchOptions = {
            method: 'DELETE',
            headers: { ...headers, ...options.headers },
            timeout,
        };
        const fullUrl = baseURL + url;
        return await this.fetchWithTimeout(fullUrl, fetchOptions);
    }
}

const ajax = new Ajax({
    baseURL: 'https://api.example.com',
    headers: {
        Authorization: 'Bearer someToken',
    },
    timeout: 10000,
});

async function getUser() {
    try {
        const user = await ajax.get('/users/1');
        console.log('Użytkownik:', user);
    } catch (error) {
        console.error(error);
    }
}

async function createUser() {
    try {
        const newUser = { name: 'Jan Kowalski', email: 'jan@example.com' };
        const user = await ajax.post('/users', newUser);
        console.log('Dodano użytkownika:', user);
    } catch (error) {
        console.error(error);
    }
}

async function updateUser() {
    try {
        const updatedUser = { name: 'Jan Nowak' };
        const user = await ajax.put('/users/1', updatedUser);
        console.log('Zaktualizowano użytkownika:', user);
    } catch (error) {
        console.error(error);
    }
}

async function deleteUser() {
    try {
        await ajax.delete('/users/1');
        console.log('Usunięto użytkownika');
    } catch (error) {
        console.error(error);
    }
}

getUser();
createUser();
updateUser();
deleteUser();

export default Ajax;
