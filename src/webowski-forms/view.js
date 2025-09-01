import React, { useState } from "react"
import ReactDOM from "react-dom"
import { createRoot } from 'react-dom/client'

function WebowskiForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		// простая валидация
		if (!name || !email || !message) {
			setError("Заполните все поля");
			return;
		}
		setError("");

		try {
			const response = await fetch(window.webowskiForms.ajaxUrl, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					action: "webowski_send_email",
					name,
					email,
					message,
					_nonce: window.webowskiForms.nonce,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSuccess("Сообщение отправлено!");
				setName("");
				setEmail("");
				setMessage("");
			} else {
				setError(data.data || "Ошибка при отправке")
			}
		} catch (err) {
			setError("Ошибка соединения")
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{error && <div style={{ color: "red" }}>{error}</div>}
			{success && <div style={{ color: "green" }}>{success}</div>}

			<div className="">
				<input
					type="text"
					placeholder="Ваше имя"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div className="">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div className="">
				<textarea
					placeholder="Сообщение"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</div>

			<button className='' type="submit">Отправить</button>
		</form>
	)
}

document.addEventListener('DOMContentLoaded', () => {
	const $$containers = document.querySelectorAll('.WebowskiForm')

	$$containers.forEach($container => {
		createRoot($container).render(<WebowskiForm />)
	})
})
