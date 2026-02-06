import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {
  getDatabase,
  ref,
  query,
  orderByKey,
  limitToFirst,
  startAfter,
  onValue,
  remove,
  set,
} from '@react-native-firebase/database';
import HiveFilter from './HiveFilter';
import ManualDataModal from './ManualDataModal';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Імпортуємо іконки

const HiveList = ({onSelectHive}) => {
  const [hives, setHives] = useState([]);
  const [totalHives, setTotalHives] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedHive, setSelectedHive] = useState(null);
  const pageSize = 20;

  const fetchHives = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const db = getDatabase();
        console.log(
          'Fetching hives from Firebase, reset:',
          reset,
          'lastKey:',
          lastKey,
          'filters:',
          JSON.stringify(appliedFilters, null, 2),
        );
        let hiveQuery = query(
          ref(db, '/hives'),
          orderByKey(),
          limitToFirst(pageSize),
        );
        if (!reset && lastKey) {
          hiveQuery = query(
            ref(db, '/hives'),
            orderByKey(),
            startAfter(lastKey),
            limitToFirst(pageSize),
          );
        }

        const unsubscribe = onValue(
          hiveQuery,
          snapshot => {
            try {
              const data = snapshot.val();
              console.log('Firebase snapshot:', JSON.stringify(data, null, 2));
              if (data && typeof data === 'object') {
                const hiveList = Object.keys(data).map(key => ({
                  hiveId: key,
                  box: data[key].box ?? null,
                  breed: data[key].breed ?? null,
                  color: data[key].color ?? null,
                  states: Array.isArray(data[key].states)
                    ? data[key].states
                    : [],
                  strength:
                    data[key].strength != null
                      ? Number(data[key].strength)
                      : null,
                  queen: data[key].queen ?? null,
                  honey: data[key].honey ?? null,
                }));

                const filteredHives = hiveList.filter(hive => {
                  try {
                    if (!appliedFilters) return true;
                    return (
                      (!appliedFilters.box ||
                        hive.box === appliedFilters.box) &&
                      (!appliedFilters.breed ||
                        hive.breed === appliedFilters.breed) &&
                      (!appliedFilters.color ||
                        hive.color === appliedFilters.color) &&
                      (!appliedFilters.states ||
                        (Array.isArray(hive.states) &&
                          appliedFilters.states.every(state =>
                            hive.states.includes(state),
                          ))) &&
                      (appliedFilters.queen === null ||
                        hive.queen === appliedFilters.queen) &&
                      (!appliedFilters.honey ||
                        hive.honey === appliedFilters.honey) &&
                      (appliedFilters.strength === null ||
                        (hive.strength != null &&
                          hive.strength === appliedFilters.strength))
                    );
                  } catch (filterError) {
                    console.error(
                      'Filter error for hive:',
                      hive,
                      filterError.message,
                    );
                    return false;
                  }
                });

                console.log(
                  'Filtered hives for page:',
                  JSON.stringify(filteredHives, null, 2),
                );
                setHives(filteredHives);
                setLastKey(
                  filteredHives.length > 0
                    ? filteredHives[filteredHives.length - 1].hiveId
                    : null,
                );

                const countQuery = query(ref(db, '/hives'), orderByKey());
                onValue(
                  countQuery,
                  countSnapshot => {
                    try {
                      const countData = countSnapshot.val();
                      if (countData && typeof countData === 'object') {
                        const hiveList = Object.keys(countData).map(key => ({
                          hiveId: key,
                          box: countData[key].box ?? null,
                          breed: countData[key].breed ?? null,
                          color: countData[key].color ?? null,
                          states: Array.isArray(countData[key].states)
                            ? countData[key].states
                            : [],
                          strength: countData[key].strength ?? null,
                          queen: countData[key].queen ?? null,
                          honey: countData[key].honey ?? null,
                        }));

                        const filteredCount = hiveList.filter(hive => {
                          try {
                            if (!appliedFilters) return true;
                            return (
                              (!appliedFilters.box ||
                                hive.box === appliedFilters.box) &&
                              (!appliedFilters.breed ||
                                hive.breed === appliedFilters.breed) &&
                              (!appliedFilters.color ||
                                hive.color === appliedFilters.color) &&
                              (!appliedFilters.states ||
                                (Array.isArray(hive.states) &&
                                  appliedFilters.states.every(state =>
                                    hive.states.includes(state),
                                  ))) &&
                              (appliedFilters.queen === null ||
                                hive.queen === appliedFilters.queen) &&
                              (!appliedFilters.honey ||
                                hive.honey === appliedFilters.honey) &&
                              (!appliedFilters.strength ||
                                hive.strength === appliedFilters.strength)
                            );
                          } catch (filterError) {
                            console.error(
                              'Filter error for count:',
                              hive,
                              filterError.message,
                            );
                            return false;
                          }
                        }).length;

                        console.log('Total filtered hives:', filteredCount);
                        setTotalHives(filteredCount);
                      } else {
                        setTotalHives(0);
                      }
                    } catch (countError) {
                      console.error(
                        'Count processing error:',
                        countError.message,
                      );
                      setTotalHives(0);
                    }
                  },
                  error => {
                    console.error('Count query error:', error.message);
                    setTotalHives(0);
                  },
                  {onlyOnce: true},
                );
              } else {
                console.log('No data or invalid data format in Firebase');
                setHives([]);
                setLastKey(null);
                setTotalHives(0);
              }
              setLoading(false);
            } catch (snapshotError) {
              console.error(
                'Snapshot processing error:',
                snapshotError.message,
              );
              setError(`Помилка обробки даних: ${snapshotError.message}`);
              setHives([]);
              setLastKey(null);
              setTotalHives(0);
              setLoading(false);
            }
          },
          error => {
            console.error('Firebase onValue error:', error.message);
            setError(`Помилка Firebase: ${error.message}`);
            setHives([]);
            setLastKey(null);
            setTotalHives(0);
            setLoading(false);
          },
        );

        return unsubscribe;
      } catch (error) {
        console.error('Fetch hives error:', error.message);
        setError(`Помилка: ${error.message}`);
        setLoading(false);
        setTotalHives(0);
        return () => {
          console.log('No listener to detach due to error');
        };
      }
    },
    [appliedFilters, lastKey],
  );

  useEffect(() => {
    fetchHives(true);
  }, [fetchHives]);

  const handleNextPage = () => {
    fetchHives();
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchHives(true);
    }
  };

  const handleApplyFilters = filters => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleDelete = async hiveId => {
    try {
      const db = getDatabase();
      await remove(ref(db, `/hives/${hiveId}`));
      console.log(`Hive ${hiveId} deleted successfully`);
      fetchHives(true);
    } catch (error) {
      console.error('Delete hive error:', error.message);
      setError(`Помилка видалення: ${error.message}`);
    }
  };

  const handleEdit = hive => {
    setSelectedHive(hive);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async editedData => {
    try {
      const db = getDatabase();
      const hiveRef = ref(db, `/hives/${editedData.hiveId}`);
      await set(hiveRef, {
        box: editedData.box,
        breed: editedData.breed,
        color: editedData.color,
        states: editedData.states,
        strength: editedData.strength,
        queen: editedData.queen,
        honey: editedData.honey,
      });
      console.log(`Hive ${editedData.hiveId} updated successfully`);
      setEditModalVisible(false);
      setSelectedHive(null);
      fetchHives(true);
    } catch (error) {
      console.error('Update hive error:', error.message);
      setError(`Помилка оновлення: ${error.message}`);
    }
  };

  const renderItem = ({item}) => {
    try {
      return (
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => onSelectHive(item)}
            style={styles.textContainer}>
            <Text>Вулик ID: {item.hiveId}</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleEdit(item)}
              style={styles.iconButton}>
              <Icon name="edit" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.hiveId)}
              style={styles.iconButton}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      );
    } catch (renderError) {
      console.error('Render item error:', renderError.message);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Filter" onPress={toggleFilters} />
      {showFilters && (
        <HiveFilter
          onApplyFilters={handleApplyFilters}
          onClose={toggleFilters}
        />
      )}
      {editModalVisible && (
        <ManualDataModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedHive(null);
          }}
          onSave={handleSaveEdit}
          initialHiveId={selectedHive?.hiveId || ''}
          initialData={selectedHive}
        />
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Завантаження даних...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {totalHives > 0 && (
            <View style={styles.floatingBadge}>
              <Text style={styles.badgeText}>{totalHives}</Text>
            </View>
          )}
          <FlatList
            data={hives}
            renderItem={renderItem}
            keyExtractor={item => item.hiveId || Math.random().toString()}
            ListEmptyComponent={<Text>Немає даних для відображення</Text>}
          />
          <View style={styles.paginationContainer}>
            <Button
              title="Попередня"
              onPress={handlePrevPage}
              disabled={page === 1}
            />
            <Text>Сторінка {page}</Text>
            <Button
              title="Наступна"
              onPress={handleNextPage}
              disabled={hives.length < pageSize}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  floatingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
});

export default HiveList;
