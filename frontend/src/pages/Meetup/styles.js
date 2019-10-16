import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { primaryButton, secondaryButton, buttonHasIcon } from '~/styles/mixins';

export const Container = styled.div`
  max-width: 900px;
  margin: 0px auto;
  padding: 50px 0;

  display: flex;
  flex-direction: column;

  header {
    display: flex;
    justify-content: space-between;
    color: #fff;
    margin-bottom: 20px;
    div {
      display: flex;
      justify-content: space-around;
      a,
      button {
        margin-left: 15px;
      }
    }
  }

  section {
    color: #efefef;
    line-height: 25px;
    font-size: 16px;

    img {
      max-width: 100%;
      margin: 0 auto;
      display: block;
      align-self: center;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  }

  footer {
    margin-top: 20px;
    color: #999;

    span,
    time {
      display: inline-flex;
      align-items: center;
      margin-right: 20px;
    }

    svg {
      fill: #999;
      margin-right: 10px;
    }
  }
`;

export const EditButton = styled(Link)`
  ${secondaryButton}
  ${buttonHasIcon}
  padding: 10px 20px;
`;
export const CancelButton = styled.button`
  ${primaryButton}
  ${buttonHasIcon}
  padding: 10px 20px;
`;
