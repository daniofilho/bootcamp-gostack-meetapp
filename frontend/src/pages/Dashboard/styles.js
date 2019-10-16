import styled from 'styled-components';
import { primaryButton, buttonHasIcon } from '~/styles/mixins';

export const Container = styled.div`
  max-width: 900px;
  margin: 50px auto 0 auto;

  width: 100%;
  min-height: 100vh;
  padding-bottom: 50px;

  display: flex;
  flex-direction: column;

  header {
    display: flex;
    justify-content: space-between;
    color: #fff;
  }
`;

export const ButtonLink = styled.div`
  ${primaryButton}
  ${buttonHasIcon}
  padding: 10px 20px;
  cursor: pointer;
`;

export const MeetupList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 15px;
  margin-top: 30px;
`;
export const Meetup = styled.div`
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 20px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  opacity: ${props => (props.past === 'true' ? '0.5' : '1')};
  strong {
    font-size: 16px;
  }

  time {
    color: #aaa;
  }
`;
