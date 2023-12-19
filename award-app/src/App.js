import { useState } from 'react';
import styles from './App.module.css';

import VideoBackground from './components/VideoBackground';
import Form from './components/Form';
import VideoPrize from './components/VideoPrize';
import Download from './components/Download';

import logo from './assets/imgs/logo.png';
import text from './assets/imgs/text.png';
import trophy from './assets/imgs/trophy.png';
import Loading from './components/Loading';

function App() {
	const [videoPrizeSrc, setVideoPrizeSrc] = useState('')
	const [scholarshipSrc, setScholarshipSrc] = useState('')
	const [entry, setEntry] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const handleFormSubmit = async (payload) => {
		setIsLoading(true)

		const apiUrl = process.env.REACT_APP_API_URL
		const searchParams = {
			action: 'search'
		}
		const response = await fetch(`${apiUrl}/?${new URLSearchParams(searchParams)}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		})

		setIsLoading(false)

		if (!response?.ok) {
			const error = await response.json()
			console.error(error)
			alert(error.message)
			return;
		}

		const responseJSON = await response.json()

		const downloadParams = {
			action: 'download',
			jwt: responseJSON.data.jwt
		}
		setScholarshipSrc(`${process.env.REACT_APP_API_URL}/?${new URLSearchParams(downloadParams)}`)

		const videoParams = {
			action: 'video',
		}
		setVideoPrizeSrc(`${process.env.REACT_APP_API_URL}/?${new URLSearchParams(videoParams)}`)

		setEntry(responseJSON.data.entry)
	}

	return (
		<>
			<VideoBackground />
			{
				!videoPrizeSrc &&
				<div className={styles.wrapper}>
					<div className={styles.colLeft}>
						<img src={logo} className={styles.logo} alt='Logo' />
						<img src={text} className={styles.text} alt='IGS Talent Meet-up Hall of Fame' />
						<Form handleFormSubmit={handleFormSubmit} />
					</div>
					<div className={styles.colRight}>
						<img src={trophy} alt='Trophy' className={styles.trophy} />
					</div>
				</div>
			}
			{
				videoPrizeSrc &&
				<VideoPrize src={videoPrizeSrc} entry={entry} />
			}
			{
				scholarshipSrc &&
				<Download scholarshipSrc={scholarshipSrc} />
			}
			{
				isLoading &&
				<Loading />
			}
		</>
	);
}

export default App;
