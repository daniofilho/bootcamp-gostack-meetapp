import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { addDays, parseISO } from 'date-fns';

import ReactDatePicker, { registerLocale } from 'react-datepicker';

import ptBR from 'date-fns/locale/pt-BR';

import { useField } from '@rocketseat/unform';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

function DateTimePicker({ name, placeholder }) {
  const ref = useRef(null);

  const { fieldName, registerField, defaultValue, error } = useField(name);

  // # must parseISO the date !!
  const [selected, setSelected] = useState(
    defaultValue ? parseISO(defaultValue) : addDays(new Date(), 1)
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.selected',
      clearValue: pickerRef => {
        pickerRef.clear();
      },
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      <ReactDatePicker
        name={fieldName}
        selected={selected}
        timeFormat="HH:mm"
        timeIntervals={30}
        locale="pt-BR"
        showTimeSelect
        onChange={date => setSelected(date)}
        ref={ref}
        minDate={addDays(new Date(), 1)}
        placeholderText={placeholder}
        dateFormat="d 'de' MMMM 'de' yyyy',' 'às' HH:mm"
      />
      {error && <span>{error}</span>}
    </>
  );
}

DateTimePicker.defaultProps = {
  placeholder: 'Selecione a data',
};

DateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default DateTimePicker;
