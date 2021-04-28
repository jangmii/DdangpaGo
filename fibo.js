exports.main_message = (id) => { 
		return {
				conversationId: id,
				text: '땅파고 챗봇',
				blocks: [
					{
						type: 'button',
						text: '마법의 소라고동',
						style: 'default',
					},
					{
						type: 'button',
						text: '한국인만 알아볼수 있는 번역기',
						style: 'default',
					},
					{
						type: 'action',
						elements: [
							{
								type: 'button',
								action_type: 'call_modal',
								value: 'fibona_chiken',
								text: '피보나치킨',
								style: 'default',
							},
							{
								type: 'button',
								text: '퇴근시간 타이머',
								style: 'default',
							},
						],
					},
					{
						type: 'action',
						elements: [
							{
								type: 'button',
								text: '기원',
								style: 'default',
							},
							{
								type: 'button',
								text: '운세 뽑기',
								style: 'default',
							},
						],
					},
				],
			}
	};
exports.fibo_modal = {
				view: {
					title: '피보나치킨',
					accept: '전송',
					decline: '취소',
					value: 'fibona_chiken_results',
					blocks: [
						{
							type: 'label',
							text: '치킨을 먹을 인원수를 알려주세요',
							markdown: false,
						},
						{
							type: 'input',
							name: 'people',
							required: true,
							placeholder: '인원수를 입력해주세요',
						},
					],
				},
			};

exports.fibo_message = (people, id) => {
		return {
				conversationId: id,
				text: '최적의 치킨 수를 찾았습니다!',
				blocks: [
					{
						type: 'header',
						text: '🐓 최적의 치킨 수 🍗',
						style: 'blue',
					},
					{
						type: 'text',
						text: '*'+ people + ' 명*이 배부르게 먹으려면',
						markdown: true,
					},
					{
						type: 'text',
						text: '*'+ fibo(people) + ' 마리*를 시키세요!',
						markdown: true,
					},
					{
						type: 'image_link',
						url: 'https://image.chosun.com/sitedata/image/201705/31/2017053100563_0.jpg',
					},
					{
						type: 'action',
						elements: [
							{
								type: 'button',
								action_type: 'call_modal',
								action_name: 'fibona_chiken',
								value: 'fibona_chiken',
								text: '다시하기',
								style: 'default',
							},
							{
								type: 'button',
								action_type:'submit_action',
								action_name: 'back',
								value: 'back',
								text: '뒤로가기',
								style: 'default',
							},
						],
					},
				],
			}
	};
	
//피보나 치킨 수 구하기
function fibo(number) {
	number *=1
	var d = [0, 1, 1],
		i,
		res = 0;

	for (i = 2; d[i - 1] < number; i++) {
		d[i] = d[i - 1] + d[i - 2];
	}

	for (; i && number; i--) {
		if (number >= d[i]) {
			number -= d[i];
			res += d[i - 1];
		}
	}
	return res;
}