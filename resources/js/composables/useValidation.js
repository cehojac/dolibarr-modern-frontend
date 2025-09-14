import { ref, reactive, computed } from 'vue'

export function useValidation(initialData = {}, rules = {}) {
  const data = reactive({ ...initialData })
  const errors = ref({})
  const touched = ref({})

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  // Validation rules
  const validators = {
    required: (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return 'Este campo es obligatorio'
      }
      return null
    },
    
    email: (value) => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Introduce un email válido'
      }
      return null
    },
    
    minLength: (min) => (value) => {
      if (!value) return null
      if (value.length < min) {
        return `Debe tener al menos ${min} caracteres`
      }
      return null
    },
    
    maxLength: (max) => (value) => {
      if (!value) return null
      if (value.length > max) {
        return `No puede tener más de ${max} caracteres`
      }
      return null
    },
    
    numeric: (value) => {
      if (!value) return null
      if (isNaN(value)) {
        return 'Debe ser un número válido'
      }
      return null
    },
    
    min: (min) => (value) => {
      if (!value) return null
      if (Number(value) < min) {
        return `El valor mínimo es ${min}`
      }
      return null
    },
    
    max: (max) => (value) => {
      if (!value) return null
      if (Number(value) > max) {
        return `El valor máximo es ${max}`
      }
      return null
    },
    
    pattern: (regex, message = 'Formato inválido') => (value) => {
      if (!value) return null
      if (!regex.test(value)) {
        return message
      }
      return null
    },
    
    custom: (fn) => (value) => {
      return fn(value)
    }
  }

  const validateField = (field, value) => {
    const fieldRules = rules[field]
    if (!fieldRules) return

    const fieldErrors = []
    
    for (const rule of fieldRules) {
      let validator
      let error

      if (typeof rule === 'string') {
        // Simple rule like 'required'
        validator = validators[rule]
        if (validator) {
          error = validator(value)
        }
      } else if (typeof rule === 'object') {
        // Rule with parameters like { type: 'minLength', value: 3 }
        const { type, value: ruleValue, message } = rule
        validator = validators[type]
        if (validator) {
          if (typeof validator === 'function' && ruleValue !== undefined) {
            // Rule that returns a validator function
            error = validator(ruleValue)(value)
          } else {
            error = validator(value)
          }
          if (error && message) {
            error = message
          }
        }
      } else if (typeof rule === 'function') {
        // Custom validation function
        error = rule(value)
      }

      if (error) {
        fieldErrors.push(error)
        break // Stop at first error
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors[0]
    } else {
      delete errors.value[field]
    }
  }

  const validate = (field = null) => {
    if (field) {
      validateField(field, data[field])
    } else {
      // Validate all fields
      Object.keys(rules).forEach(field => {
        validateField(field, data[field])
      })
    }
  }

  const touch = (field) => {
    touched.value[field] = true
  }

  const reset = () => {
    Object.keys(data).forEach(key => {
      data[key] = initialData[key] || ''
    })
    errors.value = {}
    touched.value = {}
  }

  const setData = (newData) => {
    Object.assign(data, newData)
  }

  const setError = (field, message) => {
    errors.value[field] = message
  }

  const clearError = (field) => {
    delete errors.value[field]
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    data,
    errors,
    touched,
    isValid,
    hasErrors,
    validate,
    validateField,
    touch,
    reset,
    setData,
    setError,
    clearError,
    clearErrors
  }
}
