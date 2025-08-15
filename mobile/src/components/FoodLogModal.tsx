import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import {useTheme} from '../context/ThemeContext';
import GlassCard from './GlassCard';

const {width} = Dimensions.get('window');

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface FoodLogModalProps {
  visible: boolean;
  onClose: () => void;
  onFoodAdded: (food: Food, mealType: string) => void;
}

const foods: Food[] = [
  {id: '1', name: 'Greek Yogurt', calories: 130, protein: 15, carbs: 6, fat: 8, serving: '1 cup'},
  {id: '2', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, serving: '1 medium'},
  {id: '3', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1/2 cup dry'},
  {id: '4', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4, serving: '100g'},
  {id: '5', name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 4, serving: '1 cup cooked'},
  {id: '6', name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 12, serving: '100g'},
  {id: '7', name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0, serving: '1 medium'},
  {id: '8', name: 'Almonds', calories: 161, protein: 6, carbs: 6, fat: 14, serving: '28g'},
];

const mealTypes = [
  {id: 'breakfast', name: 'Breakfast', icon: 'coffee', color: '#FF8A65'},
  {id: 'lunch', name: 'Lunch', icon: 'weather-sunny', color: '#FFB74D'},
  {id: 'dinner', name: 'Dinner', icon: 'weather-sunset', color: '#BA68C8'},
  {id: 'snack', name: 'Snack', icon: 'cookie', color: '#4DB6AC'},
];

const FoodLogModal: React.FC<FoodLogModalProps> = ({
  visible,
  onClose,
  onFoodAdded,
}) => {
  const {theme} = useTheme();
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddFood = (food: Food) => {
    onFoodAdded(food, selectedMealType);
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <LinearGradient
        colors={theme.colors.gradientSurface}
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <View style={styles.headerContent}>
            <Icon name="silverware-fork-knife" size={24} color={theme.colors.primary} />
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Log Food
            </Text>
          </View>
        </View>

        {/* Meal Type Selection */}
        <View style={styles.mealTypeContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mealTypeScroll}>
            {mealTypes.map(meal => (
              <TouchableOpacity
                key={meal.id}
                style={[
                  styles.mealTypeCard,
                  {
                    backgroundColor: selectedMealType === meal.id
                      ? theme.colors.primary + '30'
                      : 'rgba(255, 255, 255, 0.1)',
                    borderColor: selectedMealType === meal.id
                      ? theme.colors.primary
                      : 'transparent',
                  },
                ]}
                onPress={() => setSelectedMealType(meal.id)}
                activeOpacity={0.8}>
                <Icon
                  name={meal.icon}
                  size={24}
                  color={selectedMealType === meal.id ? theme.colors.primary : meal.color}
                />
                <Text
                  style={[
                    styles.mealTypeText,
                    {
                      color: selectedMealType === meal.id
                        ? theme.colors.primary
                        : theme.colors.text,
                    },
                  ]}>
                  {meal.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInput, {borderColor: theme.colors.border}]}>
            <Icon name="magnify" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchText, {color: theme.colors.text}]}
              placeholder="Search foods..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Food List */}
        <ScrollView
          style={styles.foodList}
          showsVerticalScrollIndicator={false}>
          {filteredFoods.length > 0 ? (
            filteredFoods.map(food => (
              <GlassCard key={food.id} style={styles.foodCard} glow="soft">
                <View style={styles.foodContent}>
                  <View style={styles.foodInfo}>
                    <Text style={[styles.foodName, {color: theme.colors.text}]}>
                      {food.name}
                    </Text>
                    <Text style={[styles.foodServing, {color: theme.colors.textSecondary}]}>
                      {food.serving} • {food.calories} cal
                    </Text>
                    <View style={styles.macroRow}>
                      <View style={[styles.macroBadge, {backgroundColor: theme.colors.accent + '20'}]}>
                        <Text style={[styles.macroText, {color: theme.colors.accent}]}>
                          P: {food.protein}g
                        </Text>
                      </View>
                      <View style={[styles.macroBadge, {backgroundColor: theme.colors.primary + '20'}]}>
                        <Text style={[styles.macroText, {color: theme.colors.primary}]}>
                          C: {food.carbs}g
                        </Text>
                      </View>
                      <View style={[styles.macroBadge, {backgroundColor: theme.colors.tertiary + '20'}]}>
                        <Text style={[styles.macroText, {color: theme.colors.tertiary}]}>
                          F: {food.fat}g
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.addButton, {backgroundColor: theme.colors.primary}]}
                    onPress={() => handleAddFood(food)}
                    activeOpacity={0.8}>
                    <Icon name="plus" size={20} color={theme.colors.background} />
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="food-apple" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                No foods found
              </Text>
              <Text style={[styles.emptySubtext, {color: theme.colors.textSecondary}]}>
                Try a different search term
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Add Button */}
        <TouchableOpacity
          style={[styles.quickAddButton, {backgroundColor: theme.colors.accent}]}
          activeOpacity={0.8}>
          <Icon name="plus" size={20} color={theme.colors.background} />
          <Text style={[styles.quickAddText, {color: theme.colors.background}]}>
            Quick Add Custom Food
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  mealTypeContainer: {
    marginBottom: 16,
  },
  mealTypeScroll: {
    paddingHorizontal: 4,
  },
  mealTypeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 80,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  foodList: {
    flex: 1,
    marginBottom: 16,
  },
  foodCard: {
    marginBottom: 12,
  },
  foodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodServing: {
    fontSize: 12,
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  macroText: {
    fontSize: 10,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FoodLogModal;
