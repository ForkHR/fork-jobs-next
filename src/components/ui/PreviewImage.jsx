import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { imgPlaceholder } from '../../assets/constants';
import { closeIcon, minusIcon, plugIcon, largePlusIcon, linkIcon, copyIcon, xIcon, checkIcon, downloadIcon, arrowLeftRightIcon, moreIcon, shareIcon, leftArrowIcon, arrowClockwiseIcon, arrowCounterclockwiseIcon, chevronLeftIcon, pngIcon } from '../../assets/img/icons';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import './styles/PreviewImage.css'
import IconButton from './IconButton';
import Icon from './Icon';
import { usePathname, useRouter } from 'next/navigation';

const PreviewImage = ({
    img,
    alt,
    name,
    ignoreErr,
    isLoading
}) => {
    const [loading, setLoading] = useState(false);
    const [imgErr, setImgErr] = useState(false);
    const imgRef = useRef(null);
    const bigDisplayRef = useRef(null)
    const [linkCopied, setLinkCopied] = useState(false)
    const [rotate, setRotate] = useState(0)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const img = imgRef.current
        if (img) {
        setLoading(true)
        // If image is already loaded, don't show loader
        if (img.complete) {
            setLoading(false)
        } else {
            setImgErr(false)
            setLoading(true)
        }
        // If image is not loaded, show loader
        img.addEventListener('error', () => {
            if(!ignoreErr) {
            setImgErr(true)
            }
        })
        img.addEventListener('load', () => setLoading(false))
        }

    }, [imgRef])


    return createPortal(
        img ?
        <>
            <div className="preview-img-big-display"
                ref={bigDisplayRef}
            >
                <TransformWrapper
                    initialScale={1}
                    minScale={0.25}
                    centerOnInit
                    centerZoomedOut={true}
                    initialPositionY={1}
                >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <div className="preview-img-big-display-container">
                        <div className="preview-img-big-display-controllers-top">
                            <div className="flex justify-between align-center container px-sm-2 gap-2">
                                <div className="flex-grow-1 flex align-center gap-2">
                                    <IconButton
                                        icon={chevronLeftIcon}
                                        onClick={() => router.replace(pathname)}
                                        type="secondary"
                                        variant="link"
                                    />
                                    <Icon
                                        icon={pngIcon}
                                        size="sm"
                                    />
                                    <div className="fs-14 text-ellipsis-1">
                                        {name}.{img?.split('.').pop().split('?')[0]}
                                    </div>
                                </div>
                                <Button
                                    icon={downloadIcon}
                                    type="secondary"
                                    variant="text"
                                    onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = img
                                        link.download = `${name}.${img?.split('.').pop().split('?')[0]}`
                                        document.body.appendChild(link)
                                        link.click()
                                        document.body.removeChild(link)
                                    }}
                                />
                            </div>
                        </div>
                        <TransformComponent
                            centerZoomedOut
                        >
                            <div className="preview-img-big-display-container-inner">
                                <div className="preview-img-big-display-container-inner-img">
                                    {isLoading ?
                                        <div className="spinner"/>
                                    :
                                        <img
                                            src={imgErr ? imgPlaceholder : img} 
                                            alt={alt}
                                            decoding="async"
                                            loading="lazy"
                                            style={{
                                                transform: `rotate(${rotate}deg)`
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                        </TransformComponent>
                        <div className="flex align-center justify-center bottom-0 pos-fixed py-3 preview-img-big-display-controllers-bottom">
                            <Button
                                icon={arrowClockwiseIcon}
                                onClick={() => {
                                    setRotate(rotate + 90)
                                }}
                                type="secondary"
                                variant="text"
                            />
                            <Button
                                icon={minusIcon}
                                onClick={() => {
                                    zoomOut()
                                }}
                                type="secondary"
                                variant="text"
                            />
                            <Button
                                label="Reset"
                                onClick={() => {
                                    resetTransform()
                                }}
                                type="secondary"
                                variant="text"
                            />
                            <Button
                                icon={largePlusIcon}
                                onClick={() => {
                                    zoomIn()
                                }}
                                type="secondary"
                                variant="text"
                            />
                            <Button
                                icon={arrowCounterclockwiseIcon}
                                onClick={() => {
                                    setRotate(rotate - 90)
                                }}
                                type="secondary"
                                variant="text"
                            />
                        </div>
                    </div>
                )}
                </TransformWrapper>
            </div>
        </>
        : null,
        document.body
    )
}

export default PreviewImage