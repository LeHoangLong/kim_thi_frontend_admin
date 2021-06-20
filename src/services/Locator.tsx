class Locator {
    private static services: Map<Symbol, any> = new Map<Symbol, any>();
    register(id: Symbol, service: any) {
        if (!Locator.services.has(id)) {
            Locator.services.set(id, service);
        }
    }

    get<T>(id: Symbol) : T | null {
        if (Locator.services.get(id)) {
            return Locator.services.get(id) as T;
        } else {
            return null;
        }
    }

}

export default new Locator();