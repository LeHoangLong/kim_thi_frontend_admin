import React, { useEffect, useState } from 'react'
import { IImageRepository } from './repositories/IImageRepository'
import { IOrderRepository } from './repositories/IOrderRepository'
import { IProductCategoryRepository } from './repositories/IProductCategoryRepository'
import { IProductRepository } from './repositories/IProductRepository'
import { ITransportFeeRepository } from './repositories/ITransportFeeRepository'
import { IUserRepository } from './repositories/IUserRepository'
import { RemoteImageRepository } from './repositories/RemoteImageRepository'
import { RemoteOrderRepository } from './repositories/RemoteOrderRepository'
import { RemoteProductCategoryRepository } from './repositories/RemoteProductCategoryRepository'
import { RemoteProductRepository } from './repositories/RemoteProductRepository'
import { RemoteTransportFeeRepository } from './repositories/RemoteTransportFeeRepository'
import { RemoteUserRepository } from './repositories/RemoteUserRepository'

export interface Container {
    transportFeeRepository: ITransportFeeRepository
    userRepository: IUserRepository
    productRepository: IProductRepository
    imageRepository: IImageRepository
    productCategoryRepository: IProductCategoryRepository
    orderRepository: IOrderRepository
}

let container: Container = {
    transportFeeRepository: new RemoteTransportFeeRepository(),
    userRepository: new RemoteUserRepository(),
    productRepository: new RemoteProductRepository(),
    imageRepository: new RemoteImageRepository(),
    productCategoryRepository: new RemoteProductCategoryRepository(),
    orderRepository: new RemoteOrderRepository(),
}

let observers: React.Dispatch<React.SetStateAction<Container>>[] = [];

export const setContainer = (iContainer: Container) => {
    container = iContainer
    observers.forEach(dispatch => dispatch(container))
}

export function useContainer() : [Container, (container: Container) => void] {
    let [containerState, setContainerState] = useState<Container>(container)
    useEffect(() => {
        observers.push(setContainerState)
        setContainerState(container)
        return () => {
            observers.filter(dispatch => dispatch !== setContainerState)
        }
    }, [])

    return [containerState, setContainer]
}

