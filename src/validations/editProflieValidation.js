import * as Yup from 'yup'

export const EditProfileSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z]+$/, 'Username can only contain letters')
    .required('Username is required'),

  age: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Age must be a number')
    .min(5, 'Must be at least 5 years old')
    .max(80,'Must be at most 79 years old')
    .required('Age is required'),

  gender: Yup.string().required('Please select a gender'),
})
