import Services from "../../config/Services";
import { RemoteImageRepository } from "../../repositories/RemoteImageRepository";
import { RemoteProductRepository } from "../../repositories/RemoteProductRepository";
import { RemoteUserRepository } from "../../repositories/RemoteUserRepository";
import Locator from "../../services/Locator";

export interface LocatorInitializerProps {
    children: JSX.Element,
} 

Locator.register(Services.USER_REPOSITORY, new RemoteUserRepository());
Locator.register(Services.PRODUCT_REPOSITORY, new RemoteProductRepository())
Locator.register(Services.IMAGE_REPOSITORY, new RemoteImageRepository())

export const LocatorInitializer = (props: LocatorInitializerProps) => {
    return props.children;
}