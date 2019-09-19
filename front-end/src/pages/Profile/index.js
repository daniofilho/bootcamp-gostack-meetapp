import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { MdAddCircleOutline } from 'react-icons/md';

import { Container } from './styles';

import { updateProfileRequest } from '~/store/modules/user/actions';

import Loading from '~/Components/Loading';

export default function Profile() {
  const profile = useSelector(state => state.user.profile);
  const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch();

  function handleSubmit(data) {
    dispatch(updateProfileRequest(data));
  }

  const schema = Yup.object().shape({
    avatar_id: Yup.number(),
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string()
      .email('E-mail inválido')
      .required('E-mail é obrigatório'),
    oldPassword: Yup.string().when('password', (password, field) =>
      password ? field.required('Senha atual é obrigatória') : field
    ),
    password: Yup.string()
      .transform(value => (!value ? null : value))
      .nullable()
      .min(6, 'A senha precisa conter 6 caracteres no mínimo'),
    confirmPassword: Yup.string().when('password', (password, field) =>
      password
        ? field
            .required()
            .oneOf([Yup.ref('password')], 'As senhas não conferem')
        : field
    ),
  });

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <Form initialData={profile} onSubmit={handleSubmit} schema={schema}>
          <Input name="name" type="text" placeholder="Nome Completo" />
          <Input
            name="email"
            type="email"
            placeholder="Seu endereço de e-mail"
          />
          <hr />
          <Input
            name="oldPassword"
            type="password"
            placeholder="Sua senha atual"
          />
          <Input name="password" type="password" placeholder="Nova senha" />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmação de senha"
          />
          <button type="submit">
            <MdAddCircleOutline size={20} color="#FFF" />
            Salvar perfil
          </button>
        </Form>
      )}
    </Container>
  );
}
