/**
 * 国际化翻译模块
 * 支持语言: 中文(zh)、英语(en)、韩语(ko)、俄语(ru)、西班牙语(es)
 */

// 当前语言
let currentLang = 'zh'

// ==================== 翻译数据 ====================

const messages = {
  // ===== 通用 =====
  common: {
    zh: { back: '返回', save: '保存', cancel: '取消', confirm: '确定', loading: '加载中...', edit: '编辑', share: '分享', delete: '删除', yes: '是', no: '否', done: '知道了', switch: '切换', upload: '上传', saveSuccess: '保存成功', createSuccess: '创建成功', saveFailed: '保存失败，请重试', loadFailed: '加载失败', pleaseLogin: '请登录！', pleaseLoginFirst: '请先登录', loginSuccess: '登录成功', loginFailed: '登录失败，请重试', loginProcessing: '登录中...', updating: '更新中...', updateSuccess: '更新成功', updateFailed: '更新失败', deleting: '删除', deleteConfirm: '确定要删除吗？', deleteSuccess: '删除成功' },
    en: { back: 'Back', save: 'Save', cancel: 'Cancel', confirm: 'Confirm', loading: 'Loading...', edit: 'Edit', share: 'Share', delete: 'Delete', yes: 'Yes', no: 'No', done: 'Got it', switch: 'Switch', upload: 'Upload', saveSuccess: 'Saved Successfully', createSuccess: 'Created Successfully', saveFailed: 'Save Failed, Please Retry', loadFailed: 'Load Failed', pleaseLogin: 'Please Login!', pleaseLoginFirst: 'Please Login First', loginSuccess: 'Login Successful', loginFailed: 'Login Failed, Please Retry', loginProcessing: 'Logging in...', updating: 'Updating...', updateSuccess: 'Update Successful', updateFailed: 'Update Failed', deleting: 'Delete', deleteConfirm: 'Are you sure you want to delete?', deleteSuccess: 'Deleted Successfully' },
    ko: { back: '뒤로', save: '저장', cancel: '취소', confirm: '확인', loading: '로딩 중...', edit: '편집', share: '공유', delete: '삭제', yes: '예', no: '아니오', done: '알았어요', switch: '전환', upload: '업로드', saveSuccess: '저장 성공', createSuccess: '생성 성공', saveFailed: '저장 실패, 다시 시도하세요', loadFailed: '불러오기 실패', pleaseLogin: '로그인해 주세요!', pleaseLoginFirst: '먼저 로그인해 주세요', loginSuccess: '로그인 성공', loginFailed: '로그인 실패, 다시 시도하세요', loginProcessing: '로그인 중...', updating: '업데이트 중...', updateSuccess: '업데이트 성공', updateFailed: '업데이트 실패', deleting: '삭제', deleteConfirm: '정말 삭제하시겠습니까?', deleteSuccess: '삭제 성공' },
    ru: { back: 'Назад', save: 'Сохранить', cancel: 'Отмена', confirm: 'Подтвердить', loading: 'Загрузка...', edit: 'Редактировать', share: 'Поделиться', delete: 'Удалить', yes: 'Да', no: 'Нет', done: 'Понятно', switch: 'Переключить', upload: 'Загрузить', saveSuccess: 'Сохранено', createSuccess: 'Создано', saveFailed: 'Ошибка сохранения, повторите', loadFailed: 'Ошибка загрузки', pleaseLogin: 'Пожалуйста, войдите!', pleaseLoginFirst: 'Сначала войдите', loginSuccess: 'Вход выполнен', loginFailed: 'Ошибка входа, повторите', loginProcessing: 'Вход...', updating: 'Обновление...', updateSuccess: 'Обновлено', updateFailed: 'Ошибка обновления', deleting: 'Удалить', deleteConfirm: 'Вы уверены, что хотите удалить?', deleteSuccess: 'Удалено' },
    es: { back: 'Atrás', save: 'Guardar', cancel: 'Cancelar', confirm: 'Confirmar', loading: 'Cargando...', edit: 'Editar', share: 'Compartir', delete: 'Eliminar', yes: 'Sí', no: 'No', done: 'Entendido', switch: 'Cambiar', upload: 'Subir', saveSuccess: 'Guardado', createSuccess: 'Creado', saveFailed: 'Error al guardar, intente de nuevo', loadFailed: 'Error al cargar', pleaseLogin: '¡Inicie sesión!', pleaseLoginFirst: 'Inicie sesión primero', loginSuccess: 'Inicio de sesión exitoso', loginFailed: 'Error al iniciar sesión, intente de nuevo', loginProcessing: 'Iniciando sesión...', updating: 'Actualizando...', updateSuccess: 'Actualizado', updateFailed: 'Error al actualizar', deleting: 'Eliminar', deleteConfirm: '¿Está seguro de que desea eliminar?', deleteSuccess: 'Eliminado' }
  },

  // ===== tab-bar 底部导航 =====
  tabBar: {
    zh: [{ text: '名片' }, { text: '我的' }],
    en: [{ text: 'Cards' }, { text: 'Mine' }],
    ko: [{ text: '명함' }, { text: '내 정보' }],
    ru: [{ text: 'Визитки' }, { text: 'Моё' }],
    es: [{ text: 'Tarjetas' }, { text: 'Mío' }]
  },

  // ===== index 首页 =====
  index: {
    zh: { title: '我的名片', loading: '加载中...', emptyTitle: '还没有名片', emptyHint: '点击下方按钮创建你的第一张电子名片', createCard: '创建名片', intro: '个人简介', album: '相册', recommend: '推荐', whoViewedMe: '谁看过我', shareHint: '请点击右上角分享', shareHintShort: '点击右上角分享', whoViewedMeTitle: '谁看过我', viewCount: '共有 {count} 人看过您的名片', noView: '还没有人看过您的名片', unknown: '?' },
    en: { title: 'My Card', loading: 'Loading...', emptyTitle: 'No Card Yet', emptyHint: 'Click the button below to create your first e-card', createCard: 'Create Card', intro: 'About Me', album: 'Album', recommend: 'Recommend', whoViewedMe: 'Who Viewed Me', shareHint: 'Please share via top-right corner', shareHintShort: 'Share via top-right', whoViewedMeTitle: 'Who Viewed Me', viewCount: '{count} people viewed your card', noView: 'No one has viewed your card yet', unknown: '?' },
    ko: { title: '내 명함', loading: '로딩 중...', emptyTitle: '명함이 없습니다', emptyHint: '아래 버튼을 클릭하여 첫 전자 명함을 만드세요', createCard: '명함 만들기', intro: '자기소개', album: '앨범', recommend: '추천', whoViewedMe: '나를 본 사람', shareHint: '오른쪽 상단에서 공유해주세요', shareHintShort: '오른쪽 상단 공유', whoViewedMeTitle: '나를 본 사람', viewCount: '{count}명이 내 명함을 보았습니다', noView: '아직 본 사람이 없습니다', unknown: '?' },
    ru: { title: 'Моя визитка', loading: 'Загрузка...', emptyTitle: 'Нет визитки', emptyHint: 'Нажмите кнопку ниже, чтобы создать первую электронную визитку', createCard: 'Создать визитку', intro: 'О себе', album: 'Альбом', recommend: 'Рекомендовать', whoViewedMe: 'Кто просмотрел', shareHint: 'Поделитесь через右上角', shareHintShort: 'Поделиться через右上角', whoViewedMeTitle: 'Кто просмотрел', viewCount: '{count} человек(а) просмотрели вашу визитку', noView: 'Ещё никто не просмотрел', unknown: '?' },
    es: { title: 'Mi Tarjeta', loading: 'Cargando...', emptyTitle: 'Sin Tarjeta', emptyHint: 'Haga clic en el botón para crear su primera tarjeta electrónica', createCard: 'Crear Tarjeta', intro: 'Sobre Mí', album: 'Álbum', recommend: 'Recomendar', whoViewedMe: 'Quién me Vio', shareHint: 'Comparta por la esquina superior derecha', shareHintShort: 'Compartir arriba', whoViewedMeTitle: 'Quién me Vio', viewCount: '{count} persona(s) vieron su tarjeta', noView: 'Nadie ha visto su tarjeta aún', unknown: '?' }
  },

  // ===== card-edit 编辑名片 =====
  cardEdit: {
    zh: { titleEdit: '编辑名片', titleCreate: '创建名片', addAvatar: '添加头像', addPortrait: '添加形象照', basicInfo: '基本信息', name: '姓名', nameRequired: '姓名 *', namePlaceholder: '请输入姓名', position: '职位', positionPlaceholder: '请输入职位', company: '公司', companyPlaceholder: '请输入公司名称', industry: '行业', industryPlaceholder: '请输入行业', contactInfo: '联系方式', phone: '电话', phonePlaceholder: '请输入电话号码', wechat: '微信', wechatPlaceholder: '请输入微信号', email: '邮箱', emailPlaceholder: '请输入邮箱', address: '地址', addressPlaceholder: '请输入公司地址', intro: '个人简介', introPlaceholder: '请输入个人简介', saveEdit: '保存修改', createCard: '创建名片', pleaseEnterName: '请输入姓名', saving: '保存中...', avatarUploadFailed: '头像上传失败，请重试', dataUpdated: '数据已更新', dataUpdatedContent: '该名片已被其他用户修改，是否查看最新内容？', viewLatest: '查看最新', updatedToLatest: '已更新为最新内容', avatarSizeLimit: '图片大小不能超过2MB', cardPreview: '名片预览', selectTemplate: '选择模版', templateBlue: '商务蓝', templatePurple: '优雅紫', templateGreen: '清新绿', templateGold: '尊贵金', cardBackground: '名片背景', uploadBg: '上传背景', cardPreviewResult: '实时预览', noBg: '无背景', personalIntro: '个人介绍', personalIntroPlaceholder: '请输入个人介绍', businessIntro: '业务介绍', businessIntroPlaceholder: '请输入业务介绍', attachment: '名片附件', uploadAttachment: '上传附件' },
    en: { titleEdit: 'Edit Card', titleCreate: 'Create Card', addAvatar: 'Add Avatar', addPortrait: 'Add Portrait', basicInfo: 'Basic Info', name: 'Name', nameRequired: 'Name *', namePlaceholder: 'Enter your name', position: 'Position', positionPlaceholder: 'Enter your position', company: 'Company', companyPlaceholder: 'Enter company name', industry: 'Industry', industryPlaceholder: 'Enter industry', contactInfo: 'Contact Info', phone: 'Phone', phonePlaceholder: 'Enter phone number', wechat: 'WeChat', wechatPlaceholder: 'Enter WeChat ID', email: 'Email', emailPlaceholder: 'Enter email', address: 'Address', addressPlaceholder: 'Enter company address', intro: 'About Me', introPlaceholder: 'Enter your bio', saveEdit: 'Save Changes', createCard: 'Create Card', pleaseEnterName: 'Please enter your name', saving: 'Saving...', avatarUploadFailed: 'Avatar upload failed, please retry', dataUpdated: 'Data Updated', dataUpdatedContent: 'This card was modified by another user. View the latest?', viewLatest: 'View Latest', updatedToLatest: 'Updated to latest', avatarSizeLimit: 'Image must be under 2MB', cardPreview: 'Card Preview', selectTemplate: 'Select Template', templateBlue: 'Business Blue', templatePurple: 'Elegant Purple', templateGreen: 'Fresh Green', templateGold: 'Premium Gold', cardBackground: 'Card Background', uploadBg: 'Upload Background', cardPreviewResult: 'Live Preview', noBg: 'No BG', personalIntro: 'About Me', personalIntroPlaceholder: 'Enter personal introduction', businessIntro: 'Business Profile', businessIntroPlaceholder: 'Enter business description', attachment: 'Attachments', uploadAttachment: 'Upload Attachment' },
    ko: { titleEdit: '명함 편집', titleCreate: '명함 만들기', addAvatar: '아바타 추가', addPortrait: '인물 사진 추가', basicInfo: '기본 정보', name: '이름', nameRequired: '이름 *', namePlaceholder: '이름을 입력하세요', position: '직위', positionPlaceholder: '직위를 입력하세요', company: '회사', companyPlaceholder: '회사명을 입력하세요', industry: '업종', industryPlaceholder: '업종을 입력하세요', contactInfo: '연락처', phone: '전화', phonePlaceholder: '전화번호를 입력하세요', wechat: '위챗', wechatPlaceholder: '위챗 ID를 입력하세요', email: '이메일', emailPlaceholder: '이메일을 입력하세요', address: '주소', addressPlaceholder: '회사 주소를 입력하세요', intro: '자기소개', introPlaceholder: '자기소개를 입력하세요', saveEdit: '변경사항 저장', createCard: '명함 만들기', pleaseEnterName: '이름을 입력하세요', saving: '저장 중...', avatarUploadFailed: '아바타 업로드 실패, 다시 시도하세요', dataUpdated: '데이터 업데이트됨', dataUpdatedContent: '다른 사용자가 이 명함을 수정했습니다. 최신 내용을 보시겠습니까?', viewLatest: '최신 보기', updatedToLatest: '최신 내용으로 업데이트됨', avatarSizeLimit: '이미지 크기는 2MB를 초과할 수 없습니다', cardPreview: '명함 미리보기', selectTemplate: '템플릿 선택', templateBlue: '비즈니스 블루', templatePurple: '우아한 퍼플', templateGreen: '신선한 그린', templateGold: '프리미엄 골드', cardBackground: '명함 배경', uploadBg: '배경 업로드', cardPreviewResult: '실시간 미리보기', noBg: '배경 없음', personalIntro: '개인 소개', personalIntroPlaceholder: '개인 소개를 입력하세요', businessIntro: '업무 소개', businessIntroPlaceholder: '업무 내용을 입력하세요', attachment: '첨부 파일', uploadAttachment: '파일 업로드' },
    ru: { titleEdit: 'Редактировать', titleCreate: 'Создать визитку', addAvatar: 'Добавить фото', addPortrait: 'Добавить портрет', basicInfo: 'Основная информация', name: 'Имя', nameRequired: 'Имя *', namePlaceholder: 'Введите имя', position: 'Должность', positionPlaceholder: 'Введите должность', company: 'Компания', companyPlaceholder: 'Введите название компании', industry: 'Отрасль', industryPlaceholder: 'Введите отрасль', contactInfo: 'Контакты', phone: 'Телефон', phonePlaceholder: 'Введите номер телефона', wechat: 'WeChat', wechatPlaceholder: 'Введите WeChat ID', email: 'Email', emailPlaceholder: 'Введите email', address: 'Адрес', addressPlaceholder: 'Введите адрес компании', intro: 'О себе', introPlaceholder: 'Введите информацию о себе', saveEdit: 'Сохранить', createCard: 'Создать визитку', pleaseEnterName: 'Пожалуйста, введите имя', saving: 'Сохранение...', avatarUploadFailed: 'Ошибка загрузки фото, повторите', dataUpdated: 'Данные обновлены', dataUpdatedContent: 'Эта визитка была изменена другим пользователем. Показать последнюю версию?', viewLatest: 'Показать последнюю', updatedToLatest: 'Обновлено до последней версии', avatarSizeLimit: 'Изображение должно быть менее 2МБ', cardPreview: 'Предпросмотр', selectTemplate: 'Выбрать шаблон', templateBlue: 'Бизнес синий', templatePurple: 'Элегантный фиолетовый', templateGreen: 'Освежающий зелёный', templateGold: 'Премиум золотой', cardBackground: 'Фон визитки', uploadBg: 'Загрузить фон', cardPreviewResult: 'Предпросмотр', noBg: 'Без фона', personalIntro: 'О себе', personalIntroPlaceholder: 'Введите информацию о себе', businessIntro: 'О бизнесе', businessIntroPlaceholder: 'Введите описание бизнеса', attachment: 'Вложения', uploadAttachment: 'Загрузить файл' },
    es: { titleEdit: 'Editar Tarjeta', titleCreate: 'Crear Tarjeta', addAvatar: 'Añadir Avatar', addPortrait: 'Añadir Retrato', basicInfo: 'Información Básica', name: 'Nombre', nameRequired: 'Nombre *', namePlaceholder: 'Ingrese su nombre', position: 'Cargo', positionPlaceholder: 'Ingrese su cargo', company: 'Empresa', companyPlaceholder: 'Ingrese el nombre de la empresa', industry: 'Industria', industryPlaceholder: 'Ingrese la industria', contactInfo: 'Contacto', phone: 'Teléfono', phonePlaceholder: 'Ingrese el número', wechat: 'WeChat', wechatPlaceholder: 'Ingrese ID de WeChat', email: 'Email', emailPlaceholder: 'Ingrese email', address: 'Dirección', addressPlaceholder: 'Ingrese la dirección', intro: 'Sobre Mí', introPlaceholder: 'Ingrese su biografía', saveEdit: 'Guardar Cambios', createCard: 'Crear Tarjeta', pleaseEnterName: 'Ingrese su nombre', saving: 'Guardando...', avatarUploadFailed: 'Error al subir avatar, intente de nuevo', dataUpdated: 'Datos Actualizados', dataUpdatedContent: 'Esta tarjeta fue modificada. ¿Ver la última versión?', viewLatest: 'Ver Última', updatedToLatest: 'Actualizado a la última versión', avatarSizeLimit: 'La imagen debe ser menor a 2MB', cardPreview: 'Vista Previa', selectTemplate: 'Seleccionar Plantilla', templateBlue: 'Azul Profesional', templatePurple: 'Púrpura Elegante', templateGreen: 'Verde Fresco', templateGold: 'Oro Premium', cardBackground: 'Fondo de Tarjeta', uploadBg: 'Subir Fondo', cardPreviewResult: 'Vista Previa', noBg: 'Sin Fondo', personalIntro: 'Sobre Mí', personalIntroPlaceholder: 'Ingrese su presentación personal', businessIntro: 'Sobre Negocio', businessIntroPlaceholder: 'Ingrese la descripción del negocio', attachment: 'Archivos Adjuntos', uploadAttachment: 'Subir Archivo' }
  },

  // ===== card-detail 名片详情 =====
  cardDetail: {
    zh: { title: '名片详情', call: '拨打', copy: '复制', callPhone: '拨打电话', addWechat: '添加微信', shareCard: '分享名片', companyIntro: '公司简介', editCard: '编辑名片', addWechatTitle: '添加微信好友', addWechatContent: '点击确定复制微信号', wechatCopied: '微信号已复制', copied: '已复制', cardNotExist: '名片不存在', shareWithPosition: '{name}的名片 - {position}', shareSimple: '{name}的名片', phone: '电话', website: '网址', scanQrTip: '扫码保存名片', saveContact: '保存名片', addToContacts: '添加到通讯录', intro: '个人简介', businessIntro: '业务介绍', translating: '翻译中...', savedToContacts: '名片已保存到通讯录', editHint: '点击下方编辑名片可修改' },
    en: { title: 'Card Details', call: 'Call', copy: 'Copy', callPhone: 'Call', addWechat: 'Add WeChat', shareCard: 'Share Card', companyIntro: 'Company Profile', editCard: 'Edit Card', addWechatTitle: 'Add WeChat Friend', addWechatContent: 'Click OK to copy WeChat ID', wechatCopied: 'WeChat ID copied', copied: 'Copied', cardNotExist: 'Card not found', shareWithPosition: "{name}'s Card - {position}", shareSimple: "{name}'s Card", phone: 'Phone', website: 'Website', scanQrTip: 'Scan to save card', saveContact: 'Save Contact', addToContacts: 'Add to Contacts', intro: 'About Me', businessIntro: 'Business Profile', translating: 'Translating...', savedToContacts: 'Contact saved successfully', editHint: 'Click Edit below to modify' },
    ko: { title: '명함 상세', call: '전화', copy: '복사', callPhone: '전화 걸기', addWechat: '위챗 추가', shareCard: '명함 공유', companyIntro: '회사 소개', editCard: '명함 편집', addWechatTitle: '위챗 친구 추가', addWechatContent: '확인을 클릭하여 위챗 ID 복사', wechatCopied: '위챗 ID가 복사되었습니다', copied: '복사됨', cardNotExist: '명함이 없습니다', shareWithPosition: '{name}의 명함 - {position}', shareSimple: '{name}의 명함', phone: '전화', website: '웹사이트', scanQrTip: '스캔하여 명함 저장', saveContact: '명함 저장', addToContacts: '연락처에 추가', intro: '자기소개', businessIntro: '업무 소개', translating: '번역 중...', savedToContacts: '연락처에 저장되었습니다', editHint: '아래 편집을 클릭하여 수정' },
    ru: { title: 'Детали', call: 'Позвонить', copy: 'Копировать', callPhone: 'Позвонить', addWechat: 'Добавить WeChat', shareCard: 'Поделиться', companyIntro: 'О компании', editCard: 'Редактировать', addWechatTitle: 'Добавить друга WeChat', addWechatContent: 'Нажмите OK, чтобы скопировать WeChat ID', wechatCopied: 'WeChat ID скопирован', copied: 'Скопировано', cardNotExist: 'Визитка не найдена', shareWithPosition: 'Визитка {name} - {position}', shareSimple: 'Визитка {name}', phone: 'Телефон', website: 'Веб-сайт', scanQrTip: 'Сканируйте, чтобы сохранить', saveContact: 'Сохранить контакт', addToContacts: 'В контакты', intro: 'О себе', businessIntro: 'О бизнесе', translating: 'Перевод...', savedToContacts: 'Контакт сохранён', editHint: 'Нажмите «Редактировать» ниже' },
    es: { title: 'Detalles', call: 'Llamar', copy: 'Copiar', callPhone: 'Llamar', addWechat: 'Añadir WeChat', shareCard: 'Compartir', companyIntro: 'Perfil de Empresa', editCard: 'Editar Tarjeta', addWechatTitle: 'Añadir Amigo WeChat', addWechatContent: 'Haga clic en OK para copiar ID de WeChat', wechatCopied: 'ID de WeChat copiado', copied: 'Copiado', cardNotExist: 'Tarjeta no encontrada', shareWithPosition: 'Tarjeta de {name} - {position}', shareSimple: 'Tarjeta de {name}', phone: 'Teléfono', website: 'Sitio web', scanQrTip: 'Escanee para guardar', saveContact: 'Guardar contacto', addToContacts: 'Añadir a Contactos', intro: 'Sobre Mí', businessIntro: 'Sobre Negocio', translating: 'Traduciendo...', savedToContacts: 'Contacto guardado', editHint: 'Haga clic en Editar para modificar' }
  },

  // ===== mine 我的 =====
  mine: {
    zh: { title: '我的', loginBtn: '一键登录', loginDesc: '快速登录，体验完整功能', menuTitleCard: '名片管理', menuTitleAccount: '账号管理', createCard: '创建新名片', viewAllCards: '查看全部名片', companyIntro: '公司简介', cardBg: '名片背景', switchAccount: '切换账号', logout: '退出登录', aboutTitle: '电子名片展示系统', aboutVersion: '版本 1.0.0', authCanceled: '您取消了授权', loginRequired: '需要授权才能登录', switchAccountTitle: '切换账号', switchAccountContent: '退出当前账号并重新登录？', logoutTitle: '退出登录', logoutContent: '确定要退出当前账号吗？', loggedOut: '已退出登录', getCodeFailed: '获取登录凭证失败', loginFailedShort: '登录失败', loginDataIncomplete: '返回数据不完整', noReturnData: '无返回' },
    en: { title: 'Mine', loginBtn: 'One-Click Login', loginDesc: 'Quick login to access all features', menuTitleCard: 'Card Management', menuTitleAccount: 'Account', createCard: 'Create New Card', viewAllCards: 'View All Cards', companyIntro: 'Company Profile', cardBg: 'Card Background', switchAccount: 'Switch Account', logout: 'Logout', aboutTitle: 'E-Card System', aboutVersion: 'Version 1.0.0', authCanceled: 'Authorization canceled', loginRequired: 'Authorization required to login', switchAccountTitle: 'Switch Account', switchAccountContent: 'Logout current account and re-login?', logoutTitle: 'Logout', logoutContent: 'Are you sure you want to logout?', loggedOut: 'Logged out', getCodeFailed: 'Failed to get login code', loginFailedShort: 'Login failed', loginDataIncomplete: 'Incomplete return data', noReturnData: 'No return data' },
    ko: { title: '내 정보', loginBtn: '간편 로그인', loginDesc: '빠른 로그인으로 모든 기능 이용', menuTitleCard: '명함 관리', menuTitleAccount: '계정 관리', createCard: '새 명함 만들기', viewAllCards: '모든 명함 보기', companyIntro: '회사 소개', cardBg: '명함 배경', switchAccount: '계정 전환', logout: '로그아웃', aboutTitle: '전자 명함 시스템', aboutVersion: '버전 1.0.0', authCanceled: '인증이 취소되었습니다', loginRequired: '로그인이 필요합니다', switchAccountTitle: '계정 전환', switchAccountContent: '현재 계정에서 로그아웃하고 다시 로그인하시겠습니까?', logoutTitle: '로그아웃', logoutContent: '정말 로그아웃하시겠습니까?', loggedOut: '로그아웃되었습니다', getCodeFailed: '로그인 코드를 가져오지 못했습니다', loginFailedShort: '로그인 실패', loginDataIncomplete: '반환 데이터 불완전', noReturnData: '반환 데이터 없음' },
    ru: { title: 'Моё', loginBtn: 'Войти', loginDesc: 'Быстрый вход для доступа ко всем функциям', menuTitleCard: 'Управление визитками', menuTitleAccount: 'Аккаунт', createCard: 'Создать визитку', viewAllCards: 'Все визитки', companyIntro: 'О компании', cardBg: 'Фон визитки', switchAccount: 'Сменить аккаунт', logout: 'Выйти', aboutTitle: 'Электронные визитки', aboutVersion: 'Версия 1.0.0', authCanceled: 'Авторизация отменена', loginRequired: 'Требуется авторизация', switchAccountTitle: 'Сменить аккаунт', switchAccountContent: 'Выйти из текущего аккаунта и войти снова?', logoutTitle: 'Выход', logoutContent: 'Вы уверены, что хотите выйти?', loggedOut: 'Вы вышли', getCodeFailed: 'Не удалось получить код', loginFailedShort: 'Ошибка входа', loginDataIncomplete: 'Неполные данные', noReturnData: 'Нет данных' },
    es: { title: 'Mío', loginBtn: 'Iniciar Sesión', loginDesc: 'Inicio rápido para acceder a todas las funciones', menuTitleCard: 'Gestión de Tarjetas', menuTitleAccount: 'Cuenta', createCard: 'Crear Nueva Tarjeta', viewAllCards: 'Ver Todas las Tarjetas', companyIntro: 'Perfil de Empresa', cardBg: 'Fondo de Tarjeta', switchAccount: 'Cambiar Cuenta', logout: 'Cerrar Sesión', aboutTitle: 'Sistema de Tarjetas Electrónicas', aboutVersion: 'Versión 1.0.0', authCanceled: 'Autorización cancelada', loginRequired: 'Se requiere autorización para iniciar sesión', switchAccountTitle: 'Cambiar Cuenta', switchAccountContent: '¿Cerrar sesión actual y volver a iniciar?', logoutTitle: 'Cerrar Sesión', logoutContent: '¿Está seguro de que desea cerrar sesión?', loggedOut: 'Sesión cerrada', getCodeFailed: 'Error al obtener código', loginFailedShort: 'Error al iniciar sesión', loginDataIncomplete: 'Datos incompletos', noReturnData: 'Sin datos' }
  },

  // ===== company-intro 公司简介 =====
  companyIntro: {
    zh: { title: '公司简介', label: '公司简介', placeholder: '请输入公司简介，保存后将自动应用到所有名片', hint: '💡 提示：公司简介保存后，将自动应用到您创建的所有名片详情页中' },
    en: { title: 'Company Profile', label: 'Company Profile', placeholder: 'Enter company profile, it will be applied to all cards automatically', hint: '💡 Tip: Company profile will be applied to all your card details pages' },
    ko: { title: '회사 소개', label: '회사 소개', placeholder: '회사 소개를 입력하세요. 저장하면 모든 명함에 자동 적용됩니다', hint: '💡 힌트: 회사 소개를 저장하면 모든 명함 상세 페이지에 자동 적용됩니다' },
    ru: { title: 'О компании', label: 'О компании', placeholder: 'Введите описание компании, оно будет автоматически применено ко всем визиткам', hint: '💡 Подсказка: Описание компании будет применено ко всем страницам визиток' },
    es: { title: 'Perfil de Empresa', label: 'Perfil de Empresa', placeholder: 'Ingrese el perfil de la empresa, se aplicará a todas las tarjetas', hint: '💡 Consejo: El perfil se aplicará a todas las páginas de detalles de tarjetas' }
  },

  // ===== card-bg 名片背景 =====
  cardBg: {
    zh: { title: '名片背景', currentBg: '当前背景', presetBg: '预设背景', customBg: '自定义背景', uploadImg: '上传图片', changeBg: '更换背景', changeBgConfirm: '是否确认更换此名片背景？', deleteBg: '删除背景', deleteBgConfirm: '确定要删除这张背景图吗？', uploadSuccess: '上传成功', changeSuccess: '更换成功' },
    en: { title: 'Card Background', currentBg: 'Current Background', presetBg: 'Preset Backgrounds', customBg: 'Custom Backgrounds', uploadImg: 'Upload Image', changeBg: 'Change Background', changeBgConfirm: 'Are you sure you want to change the background?', deleteBg: 'Delete Background', deleteBgConfirm: 'Are you sure you want to delete this background?', uploadSuccess: 'Upload Successful', changeSuccess: 'Changed Successfully' },
    ko: { title: '명함 배경', currentBg: '현재 배경', presetBg: '프리셋 배경', customBg: '사용자 정의 배경', uploadImg: '이미지 업로드', changeBg: '배경 변경', changeBgConfirm: '이 배경으로 변경하시겠습니까?', deleteBg: '배경 삭제', deleteBgConfirm: '이 배경을 삭제하시겠습니까?', uploadSuccess: '업로드 성공', changeSuccess: '변경 성공' },
    ru: { title: 'Фон визитки', currentBg: 'Текущий фон', presetBg: 'Готовые фоны', customBg: 'Свои фоны', uploadImg: 'Загрузить', changeBg: 'Сменить фон', changeBgConfirm: 'Вы уверены, что хотите сменить фон?', deleteBg: 'Удалить фон', deleteBgConfirm: 'Вы уверены, что хотите удалить этот фон?', uploadSuccess: 'Загружено', changeSuccess: 'Фон изменён' },
    es: { title: 'Fondo de Tarjeta', currentBg: 'Fondo Actual', presetBg: 'Fondos Predeterminados', customBg: 'Fondos Personalizados', uploadImg: 'Subir Imagen', changeBg: 'Cambiar Fondo', changeBgConfirm: '¿Está seguro de que desea cambiar el fondo?', deleteBg: 'Eliminar Fondo', deleteBgConfirm: '¿Está seguro de que desea eliminar este fondo?', uploadSuccess: 'Subido', changeSuccess: 'Cambiado' }
  }
}

// ==================== 公开 API ====================

/**
 * 翻译指定 key 的文本
 * 数据层级: messages[scope][language][key]
 * @param {string} key - 翻译键，如 'common.save'
 * @param {Object} [params] - 可选参数，用于替换 {variable}
 * @returns {string|Array}
 */
function t(key, params) {
  const keys = key.split('.')

  // 1. 获取 scope 数据
  const scopeData = messages[keys[0]]
  if (!scopeData) {
    console.warn(`[i18n] 未找到翻译键: ${key}`)
    return key
  }

  // 2. 获取当前语言的数据（单key时返回整个语言对象/数组）
  if (keys.length === 1) {
    return scopeData[currentLang] || scopeData['zh'] || key
  }

  // 3. 定位到当前语言的数据
  let value = scopeData[currentLang] || scopeData['zh']
  if (!value) {
    console.warn(`[i18n] 未找到翻译键: ${key}`)
    return key
  }

  // 4. 逐层查找子 key（从第2个开始）
  for (let i = 1; i < keys.length; i++) {
    if (value && value[keys[i]] !== undefined) {
      value = value[keys[i]]
    } else {
      console.warn(`[i18n] 未找到翻译键: ${key}`)
      return key
    }
  }

  // 5. 替换参数 {count}, {name}, {position}
  if (params && typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match
    })
  }

  return value || key
}

/**
 * 获取某个页面的所有翻译文本
 * @param {string} scope - 页面名称，如 'index', 'mine'
 * @returns {Object} 翻译文本对象
 */
function getTexts(scope) {
  const scopeData = messages[scope]
  if (!scopeData) return {}

  const langData = scopeData[currentLang]
  if (!langData) return {}

  return { ...langData }
}

/**
 * 获取某个通用翻译
 * @param {Object} [params] - 可选参数
 * @returns {Object} 通用翻译文本
 */
function getCommonTexts(params) {
  const langData = messages.common[currentLang]
  if (!langData) return {}

  return { ...langData }
}

/**
 * 获取当前语言代码
 * @returns {string}
 */
function getLocale() {
  return currentLang
}

/**
 * 设置语言
 * @param {string} lang - 语言代码: 'zh', 'en', 'ko', 'ru', 'es'
 */
function setLocale(lang) {
  if (messages.common[lang]) {
    currentLang = lang
    wx.setStorageSync('appLanguage', lang)
    // 触发全局语言变更事件
    const app = getApp()
    if (app && app.globalData) {
      app.globalData.currentLang = lang
    }
  }
}

/**
 * 获取支持的语言列表
 * @returns {Array<{code: string, name: string, nativeName: string}>}
 */
function getSupportedLanguages() {
  return [
    { code: 'zh', name: '中文', nativeName: '中文' },
    { code: 'en', name: '英语', nativeName: 'English' },
    { code: 'ko', name: '韩语', nativeName: '한국어' },
    { code: 'ru', name: '俄语', nativeName: 'Русский' },
    { code: 'es', name: '西班牙语', nativeName: 'Español' }
  ]
}

// ==================== 初始化 ====================

// 从存储中恢复语言设置
const savedLang = wx.getStorageSync('appLanguage')
if (savedLang && messages.common[savedLang]) {
  currentLang = savedLang
}

/**
 * 始终返回中文翻译（不受当前语言影响）
 * 用于关键提示，确保用户始终能看懂
 * @param {string} key - 翻译键
 * @returns {string}
 */
function tChinese(key) {
  const keys = key.split('.')

  const scopeData = messages[keys[0]]
  if (!scopeData) return key

  // 单key返回整个中文 scope
  if (keys.length === 1) {
    return scopeData['zh'] || key
  }

  // 定位到中文数据
  let value = scopeData['zh']
  if (!value) return key

  // 逐层查找子 key
  for (let i = 1; i < keys.length; i++) {
    if (value && value[keys[i]] !== undefined) {
      value = value[keys[i]]
    } else {
      return key
    }
  }

  return value || key
}

module.exports = {
  t,
  tChinese,
  getTexts,
  getCommonTexts,
  getLocale,
  setLocale,
  getSupportedLanguages
}
