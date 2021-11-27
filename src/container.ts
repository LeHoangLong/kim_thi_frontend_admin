import { Container } from 'inversify'
import { Symbols } from './config/Symbols'
import { IImageRepository } from './repositories/IImageRepository'
import { IOrderRepository } from './repositories/IOrderRepository'
import { IProductCategoryRepository } from './repositories/IProductCategoryRepository'
import { IProductRepository } from './repositories/IProductRepository'
import { ITransportFeeRepository } from './repositories/ITransportFeeRepository'
import { IUserRepository } from './repositories/IUserRepository'
import { MockOrderRepository } from './repositories/MockOrderRepository'
import { MockProductCategoryRepository } from './repositories/MockProductCategoryRepository'
import { MockProductRepository } from './repositories/MockProductRepository'
import { MockTransportFeeRepository } from './repositories/MockTransportFeeRepository'
import { RemoteImageRepository } from './repositories/RemoteImageRepository'
import { RemoteOrderRepository } from './repositories/RemoteOrderRepository'
import { RemoteProductCategoryRepository } from './repositories/RemoteProductCategoryRepository'
import { RemoteProductRepository } from './repositories/RemoteProductRepository'
import { RemoteTransportFeeRepository } from './repositories/RemoteTransportFeeRepository'
import { RemoteUserRepository } from './repositories/RemoteUserRepository'

let myContainer = new Container()

myContainer.bind<ITransportFeeRepository>(Symbols.TRANSPORT_FEE_REPOSITORY).to(RemoteTransportFeeRepository)
myContainer.bind<IUserRepository>(Symbols.USER_REPOSITORY).to(RemoteUserRepository)
myContainer.bind<IProductRepository>(Symbols.PRODUCT_REPOSITORY).to(RemoteProductRepository)
myContainer.bind<IImageRepository>(Symbols.IMAGE_REPOSITORY).to(RemoteImageRepository)
myContainer.bind<IProductCategoryRepository>(Symbols.PRODUCT_CATEGORY_REPOSITORY).to(RemoteProductCategoryRepository)
myContainer.bind<IOrderRepository>(Symbols.ORDER_REPOSITORY).to(RemoteOrderRepository)

// let mockProductCategoryRepository = new MockProductCategoryRepository(5)
// myContainer.rebind<IProductCategoryRepository>(Symbols.PRODUCT_CATEGORY_REPOSITORY).toConstantValue(mockProductCategoryRepository)
// let mockProductRepository = new MockProductRepository(mockProductCategoryRepository, 100)
// myContainer.rebind<IProductRepository>(Symbols.PRODUCT_REPOSITORY).toConstantValue(mockProductRepository)
// let mockOrderRepository = new MockOrderRepository(myContainer.get<ITransportFeeRepository>(Symbols.TRANSPORT_FEE_REPOSITORY), 100)
// myContainer.rebind<IOrderRepository>(Symbols.ORDER_REPOSITORY).toConstantValue(mockOrderRepository)

export { myContainer }
export default myContainer