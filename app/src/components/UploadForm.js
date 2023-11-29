import axios from "axios"
import { useEffect, useState } from "react"

import handleRequestError from "../utils/HandleRequestError"

import stylesRegisterForm from "./RegisterForm.module.css"
import stylesUpload from "../pages/Upload.module.css"
import styles from "./UploadForm.module.css"

import uploadSelectIcon from "../assets/svg/upload-select-icon.svg"
import uploadStartIcon from "../assets/svg/upload-start-icon.svg"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

import VideoPreview from "../utils/VideoPreview"

function Progress(props) {
    const { progress } = props
    const label = progress < 1 ? 'Uploading...' : 'Upload finished! Server is processing, please wait...'
    const progressPercent = parseInt(progress * 100)

    return (
        <div className="text-center">
            <div className="mb-3">
                <strong>{label}</strong>
            </div>
            <div className="progress" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
                <div className={`progress-bar progress-bar-striped progress-bar-animated ${styles.progress}`} style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>
    )
}

function UploadForm(props) {
    const { code: codeParam } = useParams()
    const { setIsUploadSucceeded, setIsFee } = props
    const [code, setCode] = useState(codeParam ?? '')
    const [submission, setSubmission] = useState({})
    const [token, setToken] = useState('')
    const [file, setFile] = useState(null)
    const [description, setDescription] = useState('')
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        setDescription(e.target.value)
    }

    const handleCodeInput = (e) => {
        setCode(e.target.value)
    }

    const handleSearch = async (e) => {
        e?.preventDefault()
        if (!code) return;

        const endpoint = `/submissions/search/${code}`
        const apiUrl = process.env.REACT_APP_API_URL + endpoint
        const res = await axios.get(apiUrl).catch(handleRequestError)

        if (!res) return
        if (!res.data?.accessToken || !res.data?.submission) {
            toast.error(res.data?.message ?? 'Không tìm thấy mã đăng ký!', { theme: 'colored' })
            return
        }

        setSubmission(res.data.submission ?? {})
        setToken(res.data.accessToken ?? '')

        res.data.submission?.users?.every(user => {
            if (!user.igsStudent) {
                setIsFee(true)
                return false
            }
            return true
        });
    }

    const membersRender = submission?.users?.map((member, index) => {
        return (
            <div key={index} className="text-center my-3">
                <div><strong>{member.name}</strong></div>
                <div>Trường: {member.school}</div>
                <div>{member.grade}</div>
            </div>
        )
    })

    const handleFileInput = (e) => {
        const fileInput = e.target.files[0]
        if (!fileInput) {
            setFile(null)
            return
        }

        const { type, size } = fileInput

        const allowFileTypes = ['video/mov', 'video/quicktime', 'video/mp4']

        // validate file type
        if (!allowFileTypes.includes(type)) {
            toast.error('File type is not allowed!', { theme: 'colored' })
            return
        }

        // validate file size
        if (size > process.env.REACT_APP_UPLOAD_MAX_SIZE_MB * 1024 * 1024) {
            toast.error('File size is too big', { theme: 'colored' })
            return
        }

        setFile(fileInput)
    }

    const onUploadProgress = (progress) => {
        setProgress(progress.progress)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!token || !submission.id) return

        const endpoint = '/upload/submission'
        const apiUrl = process.env.REACT_APP_API_URL + endpoint
        const formData = new FormData()
        formData.append('description', description)
        formData.append('ref', 'api::submission.submission')
        formData.append('refId', submission.id)
        formData.append('field', 'video')
        formData.append('files', file)

        const headers = {
            Authorization: `Bearer ${token}`
        }
        const res = await axios.post(apiUrl, formData, { headers, onUploadProgress }).catch(handleRequestError)
        if (!res) {
            setProgress(0)
            setFile(null)
            return
        }

        setIsUploadSucceeded(true)
    }

    useEffect(() => {
        handleSearch()
    }, []) // eslint-disable-line

    return (
        <div className="mb-5">
            {
                (!token || !submission.id) &&
                <form onSubmit={handleSearch} className="text-center">
                    <p><strong>Enter your code:</strong></p>
                    <input type="text" className={`fs-4 px-3 py-2 text-white text-center mb-3 fw-bold ${stylesRegisterForm.input}`} value={code} onChange={handleCodeInput} required={true} />
                    <button type="submit" className={`fw-bold py-2 px-4 w-100 ${stylesRegisterForm.wrapper} ${stylesRegisterForm.submitBtn}`}>Search</button>
                </form>
            }

            {
                membersRender &&
                <div className={`mb-5 ${styles.members}`}>
                    {membersRender}
                </div>
            }

            {
                (token && submission.id && !submission.video && progress <= 0) &&
                <form onSubmit={handleSubmit} className="text-center">
                    <div><strong><span className={stylesUpload.green}>Short description</span> of your performance</strong></div>
                    <div className="mb-3">(At least 10 words)</div>
                    <textarea className={`px-3 py-2 text-white ${stylesRegisterForm.textarea}`} rows={6} value={description} required={true} onChange={handleChange}></textarea>
                    <p className="px-3 mt-5 mb-3"><strong>Please upload your performance</strong></p>
                    <div className="text-center mb-3">
                        <label htmlFor="upload_file_input" className={`fw-bold px-5 py-3 ${styles.fileLabel}`}>
                            <span>Upload</span>
                            <img src={uploadSelectIcon} className={styles.uploadSelectIcon} alt="Upload Select" />
                        </label>
                    </div>
                    <input type="file" className={styles.fileInput} id="upload_file_input" onChange={handleFileInput} accept="video/mp4,video/quicktime,video/mov" required={true} />
                    {
                        file &&
                        <>
                            <VideoPreview file={file} />
                            <button type="submit" className={`rounded-circle d-flex align-items-center justify-content-center m-auto mt-3 ${styles.uploadSubmit}`}>
                                <img src={uploadStartIcon} className={styles.uploadStartIcon} alt="Upload Start" />
                            </button>
                        </>
                    }
                </form>
            }

            {
                progress > 0 &&
                <Progress progress={progress} />
            }

            {
                (token && submission.id && submission.video) &&
                <div className="text-center">
                    <div className="mb-3"><strong>You have already uploaded your performance</strong></div>
                    <VideoPreview src={submission.video.url} />
                </div>
            }
        </div>

    )
}

export default UploadForm