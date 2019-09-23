import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;
export const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: 30px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 30 },
})`
  opacity: ${props => (props.loadingMore ? 0.6 : 1)};
`;

export const DateContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
`;

export const DateButton = styled.TouchableOpacity`
  color: #fff;
`;

export const DateText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 20px;
`;

export const NoMeetupsText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
`;
