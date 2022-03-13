import React, { useEffect, useRef, useState } from "react"
import { Pagination } from "../../config/Pagination"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel"
import { clear, created, creating, fetched, setNumberOfImages, error, fetching } from "../../reducers/ImageReducer"
import { push } from "../../reducers/ErrorReducer"
import { IconButton } from "../components/IconButton"
import './ImageGallery.scss'
import Loading from "../components/Loading"
import { ImageModel } from "../../models/ImageModel"
import { useContainer } from "../../container"
import { ScrollingPageIndex } from "../components/ScrollingPageIndex"

export interface ImageGalleryProps {
    onImageClicked(image: ImageModel) : void;
    selectedImages : ImageModel[];
}

export const ImageGallery = (props : ImageGalleryProps) => {
    let images = useAppSelector(state => state.images.images)
    let imageState = useAppSelector(state => state.images.status)
    let imageRepository = useContainer()[0].imageRepository
    let fileInput = useRef<HTMLInputElement>(null)
    let formData = new FormData()
    let [isLoading, setIsLoading] = useState(false)
    let [pageNumber, setPageNumber] = useState(0)
    let numberOfImages = useAppSelector(state => state.images.numberOfImages)

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
                dispatch(error(exception as any))
                dispatch(push(exception as any))
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
            let start = pageNumber * Pagination.DEFAULT_PAGE_SIZE
            let end = (pageNumber + 1) * Pagination.DEFAULT_PAGE_SIZE
            let ret : React.ReactNode[] = []
            ret.push(
                <IconButton key="upload-button" onClick={ onNewImageClick } className="upload-image-button">
                    <p>Tạo ảnh mới từ máy</p>
                </IconButton>
            )
            for (let i = start; i < end && i < images.length; i++) {
                let image = images[i]
                if (image !== undefined) {
                    ret.push(
                        <div key={ image.id } className="image-container">
                            <img onClick={() => props.onImageClicked(image!) } alt={ image.path } src={ image.path }></img>
                            <input onChange={() => props.onImageClicked(image!)} type="checkbox" checked={ props.selectedImages.includes(image) }></input>
                        </div>
                    )
                }
            }
            return ret
        }
    }

    useEffect(() => {
        let offset = pageNumber * Pagination.DEFAULT_PAGE_SIZE
        let limit = Pagination.DEFAULT_PAGE_SIZE
        async function fetchImages() {
            let newImages = [...images]
            try {
                if (imageState.status === EStatus.INIT) {
                    dispatch(clear())
                }
                dispatch(fetching())
                let fetchedImages = await imageRepository!.fetchImages(offset, limit)
                for (let i = 0; i < offset + limit; i++) {
                    if (i >= newImages.length) {
                        newImages.push(undefined)
                    }
                }

                for (let i = offset; i < offset + limit; i++) {
                    newImages[i] = fetchedImages[i - offset]
                }
            } finally {
                dispatch(fetched(newImages))
            }
        }

        let toFetch = false
        if (imageState.status === EStatus.IDLE) {
            for (let i = offset; i < offset + limit && i < numberOfImages; i++) {
                if (images[i] === undefined) {
                    toFetch = true
                    break;
                }
            }
        }

        if (toFetch) {
            fetchImages()
        }
    }, [dispatch, imageState, imageRepository, pageNumber, images, numberOfImages])

    useEffect(() => {
        let offset = 0
        let limit = Pagination.DEFAULT_PAGE_SIZE
        async function init() {
            dispatch(clear())
            dispatch(fetching())
            let numberOfImages = await imageRepository!.fetchNumberOfImages()
            dispatch(setNumberOfImages(numberOfImages))
            let fetchedImages = await imageRepository!.fetchImages(offset, limit)
            dispatch(fetched(fetchedImages))
        }

        if (imageState.status === EStatus.INIT) {
            init()
        }
    }, [dispatch, imageState, imageRepository])

    return <article className="image-gallery">
        <input onChange={ onFileSelected } ref={ fileInput } type="file" style={{ display: 'none' }}></input>
        <h4 className="title">Kho ảnh</h4>
        <div className="images">
            { displayImages() }
        </div>
        <ScrollingPageIndex onSelect={ page => setPageNumber(page - 1) } min={ 1 } max={ Math.ceil(numberOfImages / Pagination.DEFAULT_PAGE_SIZE) + 1 } currentIndex={ pageNumber + 1 }/>
    </article>
}