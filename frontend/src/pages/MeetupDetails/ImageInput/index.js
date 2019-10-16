import React, { useState, useRef, useEffect } from 'react';
import { useField } from '@rocketseat/unform';
import { MdPhotoCamera } from 'react-icons/md';
import api from '~/services/api';

import { Container, Placeholder } from './styles';

import Loading from '~/Components/Loading';

export default function ImageInput({ name }) {
  const { defaultValue, registerField } = useField('File');

  const [file, setFile] = useState(defaultValue && defaultValue.id);
  const [preview, setPreview] = useState(defaultValue && defaultValue.url);
  const [loading, setLoading] = useState(false);

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      registerField({
        name,
        ref: ref.current,
        path: 'dataset.file',
      });
    }
  }, [ref.current]); // eslint-disable-line

  async function handleChange(e) {
    setLoading(true);
    const data = new FormData();

    data.append('file', e.target.files[0]);

    const response = await api.post('files', data);

    const { id, url } = response.data;

    setFile(id);
    setPreview(url);

    setLoading(false);
  }

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <label htmlFor={name}>
          {preview ? (
            <img src={preview} alt="" />
          ) : (
            <Placeholder>
              <MdPhotoCamera size={40} />
              <span>Selecionar imagem</span>
            </Placeholder>
          )}

          <input
            type="file"
            id={name}
            accept="image/*"
            data-file={file}
            onChange={handleChange}
            ref={ref}
          />
        </label>
      )}
    </Container>
  );
}
