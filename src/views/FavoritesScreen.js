import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

class FavoritesScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            favoriteItems: [],
        };
    }

    fetchFavorites = async () => {
        try {
            const favoriteItemsString = await AsyncStorage.getItem('likedItems');
            const favoriteItems = favoriteItemsString ? JSON.parse(favoriteItemsString) : [];
            this.setState({ favoriteItems });
        } catch (error) {
            console.error('Error fetching favorite items:', error);
        }
    };

    goToDetails = (item) => {
        this.props.navigation.navigate('Details', { selectedItem: item });
    };

    removeItem = async (index) => {
        const { favoriteItems } = this.state;
        const updatedFavorites = [...favoriteItems.slice(0, index), ...favoriteItems.slice(index + 1)];

        try {
            await AsyncStorage.setItem('likedItems', JSON.stringify(updatedFavorites));
            this.setState({ favoriteItems: updatedFavorites });
        } catch (error) {
            console.error('Error removing item from favorites:', error);
        }
    };

    showRemoveAlert = (index) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', onPress: () => this.removeItem(index), style: 'destructive' },
            ],
            { cancelable: true }
        );
    };

    renderFavoriteItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => this.goToDetails(item)}>
            <Image source={{ uri: item.strMealThumb }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.strMeal}</Text>
                <TouchableOpacity
                    onPress={() => this.showRemoveAlert(index)}
                    style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    componentDidMount() {
        this.fetchFavorites();
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.favoriteItems}
                    renderItem={this.renderFavoriteItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        marginTop: 40,
    },
    listContainer: {
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
        elevation: 2,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 18,
        color: '#333333',
    },
    deleteButton: {
        padding: 10,
        borderRadius: 50,
    },
});

export default FavoritesScreen;
