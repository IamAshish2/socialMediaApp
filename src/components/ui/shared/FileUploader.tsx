// npm install react-dropzone
import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../button';

type FileUploaderProps = {
    fieldChange: (Files: File[]) => void;
    mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl ? mediaUrl : '');

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [fieldChange])

    // define all the acceptable files format
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', 'jpg', '.svg']
        }
    })
    return (
        <div  {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (
                    <>
                        <div className='flex flex-1 justify-center w-full p-5'>
                            <img src={fileUrl} alt="image" className='file_uploader-img' />
                        </div>
                        <p className='file_uploader-label'>Click or drag photo to replace</p>
                    </>

                ) : (
                    <div className='file_uploader-box'>
                        <img src="/assets/icons/file-upload.svg" width={96} height={77} alt='file uploader' />
                        <h3 className='text-light-4 mb-2 base-medium mt-6 '>Drag photos here</h3>
                        <h3 className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</h3>
                        <Button className='shad-button_dark_4'>Select from computer</Button>
                    </div>
                )
            }
        </div>
    )
}

export default FileUploader
