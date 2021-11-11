import { Timer } from 'easytimer.js'
import { $fetch, FetchError } from 'ohmyfetch'
import ILArrow from 'virtual:icons/mdi/arrow-left'
import { defineComponent, reactive, ref} from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'

import NButton from '~/components/login/button'
import NInput from '~/components/login/input'
import LogoLink from '~/components/login/link'
import { useI18n } from '~/plugins/i18n'
import toast from '~/utils/toast'
import { checkInput } from '~/utils/validator'
export default defineComponent({
	layout: 'login',
	setup() {
		const router = useRouter()
		const { login } = useI18n().i18n.value
		const timer = new Timer()

		const sendmsg = ref('发送验证码')
		const sending = ref(false)
		const field = ref('')

		const {loading, run: try_login} = useRequest(() =>
			$fetch('/api/user/login/code', {
				method: 'POST',
				body: {
					type: 'email',
					code: field.value
				}
			}), {
			manual: true,
			onError: (e, params) => {
				if (e instanceof FetchError)
					console.log('onError', e, e instanceof FetchError, e.data, params)
				else
					console.log('onError', login.errormsg.network)
				return
			},
			onSuccess: (data) => {
				console.log('OnSuccess: ', data);
			}
		}
		)
		const try_next = () => {
			if (!checkInput(field.value, 'code6')) {
				toast(login.illegal.code, 'warning')
				return
			}
			try_login()
		}
		const resend = useRequest('/api/user/login/email', {
			manual: true,
			onError: (e, params) => {
				if (e instanceof FetchError)
					console.log('onError', e, e instanceof FetchError, e.data, params)
				else
					console.log('onError', login.errormsg.network)
				return
			},
			onSuccess: () => {
				toast('发送成功', 'success')
			}
		})

		const try_resend = () => {
			if (sending.value) return
			resend.run()
			sending.value = true
			timer.start({countdown: true, startValues: {seconds: 10}});
			sendmsg.value = timer.getTimeValues().seconds.toString() + '秒后重新发送'
			timer.addEventListener('secondsUpdated', () => {
				sendmsg.value = timer.getTimeValues().seconds.toString() + '秒后重新发送'
			})
			timer.addEventListener('targetAchieved', function () {
				console.log('倒计时结束')
				sendmsg.value = login.errormsg.resend
				sending.value = false
			});
		}

		return () => {
			return <div>
				<LogoLink to='/login/email' icon={<ILArrow/>}>{login.laststep.changeeorp}</LogoLink>
				<div w:m='t-2' w:text='2xl true-gray-900' w:font='medium'>{login.title.inputcode}</div>
				<div w:flex='~ row'>
					<NInput
						w:display='inline'
						placeholder={login.placeholder.code}
						class="tracking-1em"
						maxlength='6'
						w:text='placeholder-opacity-50 indent-xs'
						onChange={e => field.value = e}
					/>
				</div>
				<div w:text='sm cool-gray-700' w:m='t-5' w:p='l-3px'>
					{login.errormsg.hassend} xxx
				</div>
				<div w:text='xs gray-400' w:m='t-5' w:p='l-3px'>
					<span>{login.problem.nocode}</span>
					<button
						w:display='inline'
						w:text='hover:(blue-600)'
						onClick={try_resend}
					>{sendmsg.value}</button>
				</div>
				<div w:m='t-4' w:text='right'>
					<NButton
						disabled={loading.value}
						loading={loading.value}
						w:opacity={!loading.value ? '' : '50'}
						onClick={try_next}
					>
						{login.common.login}
					</NButton>
				</div>
			</div>
		}
	}
})
