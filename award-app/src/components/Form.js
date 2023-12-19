import { useState } from "react"

import styles from './Form.module.css'

function Form(props) {
    const [info, setInfo] = useState({
        name: '',
        birthday: '',
        city: '',
        phone: ''

    })
    const { handleFormSubmit } = props

    const handleInputChange = (e) => {
        setInfo(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleFormSubmit(info)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Họ tên học sinh:</label>
                <input className={styles.input} type="text" name="name" value={info.name} required={true} onChange={handleInputChange} />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Số điện thoại:</label>
                <input className={styles.input} type="tel" name="phone" value={info.phone} required={true} onChange={handleInputChange} minLength={10} />
            </div>

            <button type="submit" className={styles.submit}>Award</button>
        </form>
    )
}

export default Form