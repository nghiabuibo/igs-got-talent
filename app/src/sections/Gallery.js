import { useEffect, useState } from "react"
import socket from "../utils/Socket"

import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";

import VideoPreview from "../components/VideoPreview";

import styles from "./Gallery.module.css"

import heartIcon from "../assets/svg/heart-icon.svg"
import heartFilledIcon from "../assets/svg/heart-icon-filled.svg"
import signOutIcon from "../assets/svg/arrow-right-from-bracket.svg"

function Gallery() {
    const [credential, setCredential] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [submissions, setSubmissions] = useState([])

    useEffect(() => {
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        const credentialLocal = localStorage.getItem('igtCredential')
        if (credentialLocal) setCredential(credentialLocal)
    }, [])

    useEffect(() => {
        if (!credential) return

        socket.io.opts.query = { credential }
        socket.disconnect().connect()
        socket.emit('submission:auth')
    }, [credential])

    useEffect(() => {
        socket.on('submission:load', (initSubmissions) => {
            setSubmissions(initSubmissions)
        })

        socket.on('submission:authed', (payload) => {
            if (!payload?.email) return
            setUserEmail(payload.email)
        })

        socket.on('submission:voted', (data) => {
            const { data: updateSubmission } = data

            setSubmissions(prevSubmissions => {
                const updateSubmissions = [...prevSubmissions]
                updateSubmissions.some(submission => {
                    if (submission.code !== updateSubmission.code) return false

                    submission.votes = updateSubmission.votes
                    return true
                })
                return updateSubmissions
            })
        })

        socket.on('socket:error', (message) => {
            handleSignOut()

            if (message.includes('Token used too late')) return

            toast.error(message, { theme: 'colored' })
        })

        socket.on('socket:warn', (message) => {
            toast.warn(message, { theme: 'colored' })
        })

        socket.on('connect_error', (err) => {
            toast.error(err.message, { theme: 'colored' })
        })

        return () => {
            socket.off('submission:load')
            socket.off('submission:authed')
            socket.off('submission:voted')
            socket.off('socket:error')
            socket.off('socket:warn')
            socket.off('connect_error')
        }
    }, [])

    const handleAuthSuccess = (response) => {
        if (!response?.credential) return

        localStorage.setItem('igtCredential', response.credential)
        setCredential(response.credential)
    }

    const handleAuthError = (err) => {
        console.log(err)
        toast.error(err.message, { theme: 'colored' })
    }

    const handleSignOut = () => {
        setCredential('')
        setUserEmail('')
        localStorage.removeItem('igtCredential')
    }

    const handleVote = (code) => {
        socket.emit('submission:vote', code)
    }

    const renderSubmissions = submissions.map(submission => {
        const voteIcon = submission.votes?.includes(userEmail) ? heartFilledIcon : heartIcon
        return (
            <div key={submission.code} className="col-xl-4 col-lg-6 mb-3">
                <div className={`${styles.videoWrapper}`}>
                    <VideoPreview src={submission.video?.url} />
                </div>

                <div className={`d-flex align-items-center gap-3 ${styles.voteWrapper}`}>
                    {
                        userEmail
                            ?
                            <img src={voteIcon} role="button" className={styles.voteIcon} alt="Vote" onClick={() => handleVote(submission.code)} />
                            :
                            <GoogleLogin onSuccess={handleAuthSuccess} onError={handleAuthError} type='icon' shape='pill' />
                    }

                    <div className={`d-flex align-items-center justify-content-center ${styles.voteCount}`}>
                        {submission.votes?.length ?? 0}
                    </div>

                    <div className={`ms-auto text-end`}>
                        {
                            userEmail
                                ?
                                <img src={signOutIcon} role="button" alt="Sign out" className={`${styles.voteIcon}`} onClick={handleSignOut} />
                                :
                                <div>Sign in to vote</div>
                        }
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="row py-5 mb-5 g-0">
            {renderSubmissions}
        </div>
    )
}

export default Gallery