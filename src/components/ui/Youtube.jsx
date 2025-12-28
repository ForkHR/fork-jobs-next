import { useState } from 'react'
import { Img } from '..'

const Youtube = ({videoId, title}) => {
    const [play, setPlay] = useState(false)

    return (
        <>
        {!play ?
            <div
                onClick={() => setPlay(true)}
            >
                <Img
                    img={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={title || 'Youtube video'}
                />
            </div>
        :
            <div className="flex-1 flex justify-center w-full h-full align-center h-set-400-px">
                <div className="border-radius h-100 w-100 border-radius overflow-hidden">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?mute=1&autoplay=1&showinfo=0&rel=0&enablejsapi=1`}
                        title={title || 'Youtube video'}
                        frameborder="0"
                        width={'100%'}
                        height={'100%'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        }
        </>
    )
}

export default Youtube