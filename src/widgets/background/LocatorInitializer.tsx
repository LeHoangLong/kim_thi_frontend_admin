import Services from "../../config/Services";
import { RemoteUserRepository } from "../../repositories/RemoteUserRepository";
import Locator from "../../services/Locator";

export interface LocatorInitializerProps {
    children: JSX.Element,
} 

Locator.register(Services.USER_REPOSITORY, new RemoteUserRepository());

export const LocatorInitializer = (props: LocatorInitializerProps) => {
    return props.children;
}