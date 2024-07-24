import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import RoundBtn from '@/components/RoundBtn';
import Dropdown from '@/components/Dropdown';
import { useBalanceStore } from '@/store/balanceStore';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import WidgetList from '@/components/SortableList/WidgetList';

const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();
  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: 'Add money',
    });
  };
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>₺</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn icon={'add'} text="Add money" onPress={onAddMoney} />
        <RoundBtn
          icon={'refresh'}
          text="Exchange"
          onPress={clearTransactions}
        />
        <RoundBtn icon={'list'} text="Details" />
        <Dropdown />
      </View>
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && (
          <Text style={{ padding: 14, color: Colors.gray }}>
            No transactions yet
          </Text>
        )}
        {transactions.map((item, index) => {
          return (
            <View
              key={item.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={styles.circle}>
                <Ionicons
                  name={item.amount > 0 ? 'add' : 'remove'}
                  size={24}
                  color={Colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '500' }}>{item.title}</Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {item.date.toLocaleDateString()}
                </Text>
              </View>
              <Text>₺{item.amount}</Text>
            </View>
          );
        })}
      </View>
      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList/>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  balance: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 20,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
