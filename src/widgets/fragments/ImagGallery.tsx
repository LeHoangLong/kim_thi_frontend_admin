import React, { useEffect, useRef, useState } from "react"
import { Pagination } from "../../config/Pagination"
import Services from "../../config/Services"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { clear, created, creating, fetched, setNumberOfImages, error } from "../../reducers/ImageReducer"
import { push } from "../../reducers/ErrorReducer"
import { IImageRepository } from "../../repositories/IImageRepository"
import Locator from "../../services/Locator"
import { IconButton } from "./IconButton"
import './ImageGallery.scss'
import Loading from "./Loading"
import { ImageModel } from "../../models/ImageModel"

export interface ImageGalleryProps {
    onImageClicked(image: ImageModel) : void;
    selectedImages : ImageModel[];
}

export const ImageGallery = (props : ImageGalleryProps) => {
    let images = useAppSelector(state => state.images.images)
    let imageState = useAppSelector(state => state.images.status)
    let imageRepository = Locator.get<IImageRepository>(Services.IMAGE_REPOSITORY)
    let fileInput = useRef<HTMLInputElement>(null)
    let formData = new FormData()
    let [isLoading, setIsLoading] = useState(false)

    let dispatch = useAppDispatch()

    function onNewImageClick() {
        fileInput.current?.click()
    }

    async function onFileSelected(event : React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files !== null) {
            formData.append('image', event.target.files[0])
            dispatch(creating())
            try {
                let createdImage = await imageRepository!.createImage(formData)
                dispatch(created(createdImage))
            } catch (exception) {
                dispatch(error(exception))
                dispatch(push(exception))
            }
        }
    }

    useEffect(() => {
        if (imageState.status === EStatus.IN_PROGRESS) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [imageState])

    function displayImages() {
        if (isLoading) {
            return <Loading></Loading>
        } else {
            let ret : React.ReactNode[] = []
            ret.push(
                <IconButton key="upload-button" onClick={ onNewImageClick } className="upload-image-button">
                    <p>Tạo ảnh mới từ máy</p>
                </IconButton>
            )
            for (let i = 0; i < images.length; i++) {
                ret.push(
                    <div key={ images[i].id } className="image-container">
                        <img onClick={() => props.onImageClicked(images[i]) } alt={ images[i].path } src={ images[i].path }></img>
                        <input onChange={() => props.onImageClicked(images[i])} type="checkbox" checked={ props.selectedImages.includes(images[i]) }></input>
                    </div>
                )
            }
            return ret
        }
    }

    useEffect(() => {
        async function init() {
            dispatch(clear())
            let numberOfImages = await imageRepository!.fetchNumberOfImages()
            dispatch(setNumberOfImages(numberOfImages))
            let images = await imageRepository!.fetchImages(0, Pagination.DEFAULT_PAGE_SIZE)
            dispatch(fetched(images))
        }

        if (imageState.status === EStatus.INIT) {
            init()
        }
    }, [dispatch, imageRepository, imageState])

    return <article className="image-gallery">
        <input onChange={ onFileSelected } ref={ fileInput } type="file" style={{ display: 'none' }}></input>
        <h4 className="title">Kho ảnh</h4>
        <div className="images">
            { displayImages() }
        </div>
    </article>
}