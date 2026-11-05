import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, RefreshControl, View, type ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PokemonSummary } from '@/domain/models/Pokemon';
import { ErrorView } from '@/presentation/components/ErrorView';
import { PokemonGridSkeleton } from '@/presentation/components/PokemonGridSkeleton';
import { PokemonListFooter } from '@/presentation/components/PokemonListFooter';
import { PokemonListHeader } from '@/presentation/components/PokemonListHeader';
import { PokemonListTopBar } from '@/presentation/components/PokemonListTopBar';
import { PokemonTile } from '@/presentation/components/PokemonTile';
import { ScreenTitle } from '@/presentation/components/ScreenTitle';
import { StateView } from '@/presentation/components/StateView';
import {
  usePokemonListActions,
  usePokemonListState,
} from '@/presentation/context/PokemonListContext';
import { usePokemonGrid } from '@/presentation/hooks/usePokemonGrid';
import { spacing, useThemeColors } from '@/presentation/theme';

import { styles } from './PokemonListScreen.styles';

const keyExtractor = (item: PokemonSummary) => String(item.id);

export function PokemonListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const state = usePokemonListState();
  const { reload, refresh, loadMore } = usePokemonListActions();
  const grid = usePokemonGrid();
  const { top, bottom } = useSafeAreaInsets();
  const [scrollY] = useState(() => new Animated.Value(0));
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY],
  );
  const screenStyle = [styles.screen, { paddingTop: top, backgroundColor: colors.background }];

  const openDetail = useCallback(
    ({ id }: PokemonSummary) => {
      router.push({ pathname: '/pokemon/[id]', params: { id } });
    },
    [router],
  );

  const renderItem = useCallback<ListRenderItem<PokemonSummary>>(
    ({ item }) => <PokemonTile pokemon={item} width={grid.tileWidth} onPress={openDetail} />,
    [openDetail, grid.tileWidth],
  );

  if (state.status === 'loading') {
    return (
      <View style={screenStyle}>
        <View style={[styles.loadingTitle, { width: grid.contentWidth }]}>
          <ScreenTitle title="Pokédex" />
        </View>
        <PokemonGridSkeleton {...grid} />
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={screenStyle}>
        <ErrorView error={state.error} onRetry={() => void reload()} />
      </View>
    );
  }

  if (state.items.length === 0) {
    return (
      <View style={screenStyle}>
        <StateView
          title="No hay Pokémon para mostrar"
          message="PokéAPI no devolvió resultados."
          actionLabel="Volver a cargar"
          onAction={() => void reload()}
        />
      </View>
    );
  }

  return (
    <View style={screenStyle}>
      <Animated.FlatList
        testID="pokemon-list"
        key={grid.columns}
        data={state.items}
        numColumns={grid.columns}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.content,
          { width: grid.contentWidth, paddingBottom: bottom + spacing.xl },
        ]}
        ListHeaderComponent={
          <PokemonListHeader isStale={state.isStale} totalCount={state.totalCount} />
        }
        ListFooterComponent={
          <PokemonListFooter
            paging={state.paging}
            error={state.pagingError}
            onRetry={() => void loadMore()}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={state.paging === 'refreshing'}
            onRefresh={() => void refresh()}
            tintColor={colors.textMuted}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        onEndReached={state.pagingError ? undefined : () => void loadMore()}
        onEndReachedThreshold={0.6}
        initialNumToRender={grid.columns * 5}
        maxToRenderPerBatch={grid.columns * 5}
        windowSize={7}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      <PokemonListTopBar title="Pokédex" scrollY={scrollY} />
    </View>
  );
}
