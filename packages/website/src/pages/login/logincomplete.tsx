import {customAlphabet, nanoid} from 'nanoid'
import { $fetch } from 'ohmyfetch'
import queryString from 'query-string'
import { defineComponent, reactive, ref} from 'vue'
import { useRoute,useRouter } from 'vue-router'

// import { useNuxtApp } from '#app'
export default defineComponent({
	setup() {
		const router = useRouter()
		const route = useRoute()
		const exchange_ff = async function () {
			// const storage = useNuxtApp().$__storage
			// const code_verifier = await storage.getItem('code_challenge')
			const customed_nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz', 80)
			const state = nanoid()
			const code_challenge = customed_nanoid()
			const code_verifier = code_challenge
			try {
				const url = queryString.stringifyUrl({
					url: '/api/oauth/authorize', query: {
						response_type: 'code',
						client_id: process.env['IO_OAUTH_WEB_ID'],
						redirect_uri: 'http://localhost:3000/login/logincomplete',
						state,
						code_challenge,
						code_challenge_method: 'plain'
					}
				});
				window.location.href = url

				console.log({
					grant_type: 'authorization_code',
					client_id: process.env['IO_OAUTH_WEB_ID'],
					redirect_uri: 'http://localhost:3000/login/logincomplete',
					code: route.query.code,
					code_verifier: code_verifier,
				});

				// const res = await $fetch('http://localhost:3000/api/oauth/token', {
				// 	method: 'POST',
				// 	body:{
				// 		grant_type: 'authorization_code',
				// 		client_id: process.env['IO_OAUTH_WEB_ID'],
				// 		redirect_uri: 'http://localhost:3000/login/logincomplete',
				// 		code: route.query.code,
				// 		code_verifier: code_verifier,
				// 	}
				// })
				// console.log(await res.text());
			} catch(e) {
				console.log(e, e.data);
			}
		}
		exchange_ff()

		return () => {
			return <div
				w:flex='~ grow'
				w:justify='center'
				w:align='items-center'
				w:h='full'
				w:p='8'
				w:border='1 rounded'
			>
				<div
					w:w='100'
					w:p='8'
					w:align='items-center'
					w:border='1 '
				>
					你已经登录了, 别看了!!!
				</div>
			</div>
		}
	}
})
