import styled from 'styled-components';
import colors from '../../styles/colors';
import { primaryButton } from '~/styles/mixins';

export const Container = styled.div`
  background: #000;
  padding: 10px 30px;
`;

export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
      padding-right: 20px;
    }

    a {
      font-weight: bold;
      color: ${colors.primary};
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #fff;
    }

    a {
      display: block;
      margin-top: 2px;
      color: #999;
    }
  }
  button {
    ${primaryButton}
    margin: 5px 10px;
    padding: 5px 10px;
  }
`;
