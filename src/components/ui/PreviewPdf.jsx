import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { minusIcon, chevronRightIcon, chevronLeftIcon, plusIcon, pdfIcon, downloadIcon } from '../../assets/img/icons';
import Button from './Button';
import './styles/PreviewPdf.css';
import IconButton from './IconButton';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Icon from './Icon';
import { usePathname, useRouter } from 'next/navigation';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const PreviewPdf = ({
    file,
    name,
    onClose,
    isLoading
}) => {
    const bigDisplayRef = useRef(null)
    const [scale, setScale] = useState(1)
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if( bigDisplayRef.current) {
            document.body.appendChild(bigDisplayRef.current);
        }
    
        return () => {
            if(bigDisplayRef.current && document.body.contains(bigDisplayRef.current)) {
                bigDisplayRef.current.remove();
            }
        }
    }, [])

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    return createPortal(
        file ?
        <>
            <div className="preview-pdf-big-display"
                ref={bigDisplayRef}
            >
                    <div className="preview-pdf-big-display-container">
                        <div className="preview-pdf-big-display-controllers-top">
                            <div className="flex justify-between align-center container px-sm-2 gap-2">
                                <div className="flex-grow-1 flex align-center gap-3">
                                    <IconButton
                                        icon={chevronLeftIcon}
                                        type="secondary"
                                        variant="link"
                                        className="text-white"
                                        onClick={() => {
                                            if (onClose) {
                                                onClose()
                                            } else {
                                                router.replace(pathname)
                                            }
                                        }}
                                    />
                                    <Icon
                                        icon={pdfIcon}
                                        size="sm"
                                    />
                                    <div className="fs-14 text-ellipsis-1">
                                        {name}.{file?.split('.').pop()?.split('?')[0]}
                                    </div>
                                </div>
                                <Button
                                    icon={downloadIcon}
                                    type="secondary"
                                    variant="text"
                                    onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = file
                                        link.download = `${name}.${file?.split('.').pop()?.split('?')[0]}`
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="preview-pdf-big-display-container-inner">
                            <div className="preview-pdf-big-display-container-inner-pdf text-white">
                                {isLoading ?
                                    <div className="spinner"/>
                                :
                                    <Document
                                        file={file}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                    >
                                        <Page 
                                            pageNumber={pageNumber}
                                            width={bigDisplayRef.current?.clientWidth - 50}
                                            height={bigDisplayRef.current?.clientHeight}
                                            scale={scale}
                                        />
                                    </Document>
                                }
                            </div>
                        </div>
                        <div className="flex align-center preview-pdf-big-display-controllers-bottom justify-center bottom-0 pos-fixed py-3">
                            <div className="flex gap-4">
                                <div
                                    className="flex align-center"
                                >
                                    <Button
                                        icon={chevronLeftIcon}
                                        disabled={pageNumber <= 1}
                                        onClick={() => {
                                            setPageNumber(pageNumber - 1)
                                        }}
                                        type="secondary"
                                        variant="text"
                                        className="fill-white hover-none"
                                    />
                                    <Button
                                        label={`${pageNumber || 1}/${numPages || 1}`}
                                        type="secondary"
                                        className="fill-white hover-none text-white"
                                        variant="text"
                                    />
                                    <Button
                                        icon={chevronRightIcon}
                                        disabled={pageNumber >= numPages}
                                        onClick={() => {
                                            setPageNumber(pageNumber + 1)
                                        }}
                                        type="secondary"
                                        className="fill-white hover-none text-white"
                                        variant="text"
                                    />
                                </div>
                                <div
                                    className="flex align-center"
                                >
                                    <Button
                                        icon={minusIcon}
                                        onClick={() => {
                                            setScale(scale - 0.25)
                                        }}
                                        disabled={scale <= 0.25}
                                        type="secondary"
                                        variant="text"
                                        className="fill-white hover-none"
                                    />
                                    <Button
                                        label={`${scale.toFixed(2)}`}
                                        type="secondary"
                                        variant="text"
                                        className="fill-white hover-none text-white"
                                        onClick={() => {
                                            setScale(1)
                                        }}
                                    />
                                    <Button
                                        icon={plusIcon}
                                        onClick={() => {
                                            setScale(scale + 0.25)
                                        }}
                                        type="secondary"
                                        variant="text"
                                        className="fill-white hover-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
        : null,
        document.body
    )
}

export default PreviewPdf