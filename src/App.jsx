import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import { useFetch } from './hooks/useFetch'

function App() {
  // Состояние формы
  const [form, setForm] = useState({
    fullName: '',
    city: '',
    district: '',
    birthDate: '',
    request: '',
    requestComments: '',
    phone: '',
    disabilityGroup: '',
    disabilityForm: '',
    education: '',
    educationDetails: '',
    training: '',
    email: '',
    additionalInfo: '',
    vk: '',
    telegram: '',
    consent: false
  })

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeakFields, setAutoSpeakFields] = useState(true)
  const [currentField, setCurrentField] = useState('')
  const speechSynth = useRef(null)

  // Словари для озвучки выбранных значений
  const optionLabels = {
    disabilityGroup: {
      '': 'Не выбрано',
      '1': 'Первая группа инвалидности',
      '2': 'Вторая группа инвалидности',
      '3': 'Третья группа инвалидности',
      'child': 'Ребенок инвалид',
      'none': 'Нет инвалидности'
    },
    disabilityForm: {
      '': 'Не выбрано',
      'vision': 'Нарушение зрения',
      'hearing': 'Нарушение слуха',
      'mobility': 'Нарушение опорно-двигательного аппарата',
      'intellectual': 'Интеллектуальные нарушения',
      'mental': 'Психические нарушения',
      'multiple': 'Множественные нарушения'
    },
    education: {
      '': 'Не выбрано',
      'secondary': 'Среднее образование',
      'secondary-special': 'Среднее специальное образование',
      'incomplete-higher': 'Неоконченное высшее образование',
      'higher': 'Высшее образование',
      'bachelor': 'Бакалавр',
      'master': 'Магистр',
      'phd': 'Кандидат наук',
      'doctor': 'Доктор наук'
    }
  }

  // Инициализация
  useEffect(() => {
    speechSynth.current = window.speechSynthesis

    if (!speechSynth.current) {
      console.warn('Web Speech API не поддерживается в этом браузере')
      alert('Ваш браузер не поддерживает озвучку текста. Рекомендуем использовать Chrome или Edge.')
    }

    return () => {
      stopSpeech()
    }
  }, [])

  // Обработчик изменения полей формы
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Озвучка текста
  const speakText = (text) => {
    if (!speechSynth.current || isSpeaking) return

    stopSpeech()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ru-RU'
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    speechSynth.current.speak(utterance)
  }

  // Озвучка поля
  const speakField = (fieldName) => {
    setCurrentField(fieldName)
    speakText(`Поле: ${fieldName}. Используйте стрелки вверх и вниз для выбора варианта.`)
  }

  // Автоозвучка при фокусе
  const autoSpeakField = (fieldName) => {
    if (autoSpeakFields) {
      speakField(fieldName)
    }
  }

  // Остановка озвучки
  const stopSpeech = () => {
    if (speechSynth.current) {
      speechSynth.current.cancel()
    }
    setIsSpeaking(false)
  }

  const speakCurrentField = () => {
    if (currentField) {
      speakField(currentField)
    }
  }

  const speakAllForm = () => {
    const formDescription = `Добро пожаловать в анкету доступности. 
      Форма содержит следующие:
      блок Контактные данные с полями
      ФИО фамилия имя отчество, Дата рождения, Телефон, Электронная почта, Город, Район,  
      блок Ваш запрос  с полями
      Ваш запрос, Комментарии к запросу, 
      блок Ваши особенности с полями
      Группа инвалидности, Форма инвалидности, 
      блок Ваши Ваше образование с полями
      Образование, Подробности образования, 
      Обучение и специальность,  
      блок Дополнительная информация с полями
      Дополнительная информация, 
      Страница ВКонтакте, Ник в Телеграм, 
      и согласие на обработку данных.
      Обязательные поля помечены звездочкой. Используйте Tab для навигации.`
    speakText(formDescription)
  }

  // Озвучка выбранного значения
  const speakSelectedOption = (fieldName, value) => {
    const label = optionLabels[fieldName]?.[value] || value
    speakText(`Выбрано: ${label}`)
  }

  const submitForm = (e) => {
    e.preventDefault()
    
    if (!form.consent) {
      alert('Необходимо принять условия обработки персональных данных')
      return
    }

    console.log('Данные формы:', form)
    speakText('Форма успешно отправлена! Спасибо за вашу заявку.')
  }

  const resetForm = () => {
    if (confirm('Вы уверены, что хотите очистить все поля?')) {
      setForm({
        fullName: '',
        city: '',
        district: '',
        birthDate: '',
        request: '',
        requestComments: '',
        phone: '',
        disabilityGroup: '',
        disabilityForm: '',
        education: '',
        educationDetails: '',
        training: '',
        email: '',
        additionalInfo: '',
        vk: '',
        telegram: '',
        consent: false
      })
      speakText('Форма очищена. Все поля сброшены.')
    }
  }

  const {isLoading, data, error} = useFetch('/api/form/1/questions/')
  
  if(isLoading){
    return <p>Загрузка...</p>
  }
  if(error){
    return <p>{error}</p>
  }

  return (
    <div className="container">
      {/* Кнопки управления озвучкой */}
      <div className="voice-controls">
        <button 
          onClick={speakAllForm} 
          className="voice-btn" 
          disabled={isSpeaking}
        >
          🔊 Озвучить всю форму
        </button>
        <button 
          onClick={stopSpeech} 
          className="voice-btn stop" 
          disabled={!isSpeaking}
        >
          ⏹️ Остановить
        </button>
        <button 
          onClick={speakCurrentField} 
          className="voice-btn" 
          disabled={!currentField}
        >
          🎤 Повторить поле
        </button>
        <label className="voice-toggle">
          <input 
            type="checkbox" 
            checked={autoSpeakFields}
            onChange={(e) => setAutoSpeakFields(e.target.checked)}
          />
          Автоозвучка при наведении
        </label>
      </div>

      <form onSubmit={submitForm} className="accessibility-form">
        <h1>Заявка на содействие в трудоустройстве</h1>

        <fieldset>
          <legend onMouseOver={() => speakField('блок с контактными данными')}>Контактные данные</legend>
          {/* ФИО */}
          <div className="form-group">
            <label 
              htmlFor="fullName" 
              onMouseEnter={() => speakField('введите свои фамилию имя отчество')}
            >
              ФИО *
            </label>
            <input 
              id="fullName" 
              value={form.fullName} 
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              type="text" 
              required 
              onFocus={() => autoSpeakField('ФИО')}
              placeholder="Введите ваше полное имя" 
            />
          </div>
          
          {/* Дата рождения */}
          <div className="form-group">
            <label 
              htmlFor="birthDate" 
              onMouseEnter={() => speakField('Дата рождения')}
            >
              Дата рождения
            </label>
            <input 
              id="birthDate" 
              value={form.birthDate} 
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              type="date" 
              onFocus={() => autoSpeakField('Дата рождения')} 
            />
          </div>
          
          {/* Телефон */}
          <div className="form-group">
            <label 
              htmlFor="phone" 
              onMouseEnter={() => speakField('Телефон, обязательное поле')}
            >
              * Телефон
            </label>
            <input 
              id="phone" 
              value={form.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)}
              type="tel" 
              required 
              onFocus={() => autoSpeakField('Телефон')}
              placeholder="+7 (XXX) XXX-XX-XX"
              pattern="\+7\s?[\(]{0,1}[0-9]{3}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}" 
            />
          </div>
          
          {/* Электронная почта */}
          <div className="form-group">
            <label 
              htmlFor="email" 
              onMouseEnter={() => speakField('Электронная почта')}
            >
              Электронная почта
            </label>
            <input 
              id="email" 
              value={form.email} 
              onChange={(e) => handleInputChange('email', e.target.value)}
              type="email" 
              onFocus={() => autoSpeakField('Электронная почта')}
              placeholder="example@mail.ru" 
            />
          </div>

          {/* Город и район */}
          <div className="form-group">
            <label 
              htmlFor="city" 
              onMouseEnter={() => speakField('Город проживания')}
            >
              Город
            </label>
            <input 
              id="city" 
              value={form.city} 
              onChange={(e) => handleInputChange('city', e.target.value)}
              type="text" 
              onFocus={() => autoSpeakField('Город')}
              placeholder="Ваш город" 
            />
          </div>
          
          <div className="form-group">
            <label 
              htmlFor="district" 
              onMouseEnter={() => speakField('Район города')}
            >
              Район
            </label>
            <input 
              id="district" 
              value={form.district} 
              onChange={(e) => handleInputChange('district', e.target.value)}
              type="text" 
              onFocus={() => autoSpeakField('Район')}
              placeholder="Район города" 
            />
          </div>
        </fieldset>

        <fieldset>
          <legend onMouseOver={() => speakField('блок Ваш запрос')}>Ваш запрос</legend>
          {/* Ваш запрос */}
          <div className="form-group">
            <label 
              htmlFor="request" 
              onMouseEnter={() => speakField('Ваш запрос, обязательное поле')}
            >
              * Ваш запрос
            </label>
            <textarea 
              id="request" 
              value={form.request} 
              onChange={(e) => handleInputChange('request', e.target.value)}
              required 
              onFocus={() => autoSpeakField('Ваш запрос')}
              placeholder="Опишите ваш запрос" 
              rows="3"
            />
          </div>

          {/* Комментарии к запросу */}
          <div className="form-group">
            <label 
              htmlFor="requestComments" 
              onMouseEnter={() => speakField('Комментарии к запросу')}
            >
              Ваш запрос. Комментарии
            </label>
            <textarea 
              id="requestComments" 
              value={form.requestComments} 
              onChange={(e) => handleInputChange('requestComments', e.target.value)}
              onFocus={() => autoSpeakField('Комментарии к запросу')} 
              placeholder="Дополнительные комментарии"
              rows="2"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend onMouseOver={() => speakField('блок Ваши особенности')}>Ваши особенности</legend>
          
          {/* Группа инвалидности */}
          <div className="form-group">
            <label 
              htmlFor="disabilityGroup" 
              onMouseEnter={() => speakField('Группа инвалидности, обязательное поле')}
            >
              * Группа инвалидности
            </label>
            <select 
              id="disabilityGroup" 
              value={form.disabilityGroup} 
              onChange={(e) => {
                handleInputChange('disabilityGroup', e.target.value)
                speakSelectedOption('disabilityGroup', e.target.value)
              }}
              required
              onFocus={() => autoSpeakField('Группа инвалидности. Выберите из списка')}
            >
              <option value="">Выберите группу</option>
              <option value="1">1 группа</option>
              <option value="2">2 группа</option>
              <option value="3">3 группа</option>
              <option value="child">Ребенок-инвалид</option>
              <option value="none">Нет инвалидности</option>
            </select>
          </div>

          {/* Форма инвалидности */}
          <div className="form-group">
            <label 
              htmlFor="disabilityForm" 
              onMouseEnter={() => speakField('Форма инвалидности, обязательное поле')}
            >
              * Форма инвалидности
            </label>
            <select 
              id="disabilityForm" 
              value={form.disabilityForm} 
              onChange={(e) => {
                handleInputChange('disabilityForm', e.target.value)
                speakSelectedOption('disabilityForm', e.target.value)
              }}
              required
              onFocus={() => autoSpeakField('Форма инвалидности. Выберите из списка')}
            >
              <option value="">Выберите форму</option>
              <option value="vision">Нарушение зрения</option>
              <option value="hearing">Нарушение слуха</option>
              <option value="mobility">Нарушение опорно-двигательного аппарата</option>
              <option value="intellectual">Интеллектуальные нарушения</option>
              <option value="mental">Психические нарушения</option>
              <option value="multiple">Множественные нарушения</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend onMouseOver={() => speakField('блок Ваше образование')}>Ваше образование</legend>

          {/* Образование */}
          <div className="form-group">
            <label 
              htmlFor="education" 
              onMouseEnter={() => speakField('Образование, обязательное поле')}
            >
              * Образование
            </label>
            <select 
              id="education" 
              value={form.education} 
              onChange={(e) => {
                handleInputChange('education', e.target.value)
                speakSelectedOption('education', e.target.value)
              }}
              required
              onFocus={() => autoSpeakField('Образование. Выберите из списка')}
            >
              <option value="">Выберите образование</option>
              <option value="secondary">Среднее</option>
              <option value="secondary-special">Среднее специальное</option>
              <option value="incomplete-higher">Неоконченное высшее</option>
              <option value="higher">Высшее</option>
              <option value="bachelor">Бакалавр</option>
              <option value="master">Магистр</option>
              <option value="phd">Кандидат наук</option>
              <option value="doctor">Доктор наук</option>
            </select>
          </div>

          {/* Подробности образования */}
          <div className="form-group">
            <label 
              htmlFor="educationDetails" 
              onMouseEnter={() => speakField('Подробности образования')}
            >
              Образование. Подробности
            </label>
            <input 
              id="educationDetails" 
              value={form.educationDetails} 
              onChange={(e) => handleInputChange('educationDetails', e.target.value)}
              type="text"
              onFocus={() => autoSpeakField('Подробности образования')}
              placeholder="Дополнительная информация об образовании" 
            />
          </div>

          {/* Обучение и специальность */}
          <div className="form-group">
            <label 
              htmlFor="training" 
              onMouseEnter={() => speakField('Где и чему обучались, специальность, курсы')}
            >
              Где и чему обучались. Специальность. Курсы
            </label>
            <textarea 
              id="training" 
              value={form.training} 
              onChange={(e) => handleInputChange('training', e.target.value)}
              onFocus={() => autoSpeakField('Обучение и специальность')}
              placeholder="Учебные заведения, курсы, специальности" 
              rows="3"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend onMouseOver={() => speakField('блок Дополнительная информация')}>Дополнительная информация</legend>
          
          {/* Дополнительная информация */}
          <div className="form-group">
            <label 
              htmlFor="additionalInfo" 
              onMouseEnter={() => speakField('Дополнительная информация')}
            >
              Дополнительная информация
            </label>
            <textarea 
              id="additionalInfo" 
              value={form.additionalInfo} 
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              onFocus={() => autoSpeakField('Дополнительная информация')} 
              placeholder="Любая дополнительная информация"
              rows="3"
            />
          </div>

          {/* Страница ВК */}
          <div className="form-group">
            <label 
              htmlFor="vk" 
              onMouseEnter={() => speakField('Страница в ВКонтакте')}
            >
              Страница в ВК
            </label>
            <input 
              id="vk" 
              value={form.vk} 
              onChange={(e) => handleInputChange('vk', e.target.value)}
              type="url" 
              onFocus={() => autoSpeakField('Страница ВКонтакте')}
              placeholder="https://vk.com/username" 
            />
          </div>

          {/* Телеграм */}
          <div className="form-group">
            <label 
              htmlFor="telegram" 
              onMouseEnter={() => speakField('Ник в Телеграм')}
            >
              Ник в Телеграм
            </label>
            <input 
              id="telegram" 
              value={form.telegram} 
              onChange={(e) => handleInputChange('telegram', e.target.value)}
              type="text" 
              onFocus={() => autoSpeakField('Ник в Телеграм')}
              placeholder="@username" 
            />
          </div>
        </fieldset>

        {/* Согласие */}
        <div className="form-group consent">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={form.consent}
              onChange={(e) => handleInputChange('consent', e.target.checked)}
              required
              onFocus={() => autoSpeakField('Принимаю условия обработки персональных данных')} 
            />
            <span onMouseEnter={() => speakField('Принимаю условия обработки персональных данных')}>
              * Принимаю условия обработки персональных данных
            </span>
          </label>
        </div>

        {/* Кнопки отправки */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={!form.consent} onMouseOver={() => speakField('кнопка Отправить анкету')}>
            Отправить анкету
          </button>
          <button type="button" onClick={resetForm} className="reset-btn" onMouseOver={() => speakField('кнопка  Очистить форму')}>
            Очистить форму
          </button>
        </div>
      </form>
    </div>
  )
}

export default App