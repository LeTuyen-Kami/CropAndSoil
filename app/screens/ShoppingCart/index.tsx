import { FlashList } from "@shopify/flash-list";
import Checkbox from "expo-checkbox";
import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Badge from "~/components/common/Badge";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import ShoppingCartStore from "./ShoppingCartStore";
import { Store } from "./types";
import Footer from "./Footer";

// Mock data for the shopping cart
const mockStores: Store[] = [
  {
    id: "1",
    name: "VTNN Ong Biển",
    isSelected: false,
    items: [
      {
        id: "101",
        name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
        image: "https://picsum.photos/200/300",
        price: 160000,
        originalPrice: 220000,
        type: "NPK Rau Phú Mỹ",
        quantity: 1,
        isSelected: true,
      },
      {
        id: "102",
        name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
        image: "https://picsum.photos/200/301",
        price: 160000,
        originalPrice: 220000,
        type: "NPK Rau Phú Mỹ",
        quantity: 1,
        isSelected: true,
      },
      {
        id: "103",
        name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
        image: "https://picsum.photos/200/302",
        price: 160000,
        originalPrice: 220000,
        type: "NPK Rau Phú Mỹ",
        quantity: 1,
        isSelected: false,
      },
    ],
  },
  {
    id: "2",
    name: "VTNN Hải Sản",
    isSelected: true,
    items: [
      {
        id: "201",
        name: "Tôm tươi",
        image: "https://picsum.photos/200/300",
        price: 160000,
        originalPrice: 220000,
        type: "NPK Rau Phú Mỹ",
        quantity: 1,
        isSelected: true,
      },
    ],
  },
];

const ShoppingCart = () => {
  const [stores, setStores] = useState(mockStores);

  // Calculate total price and savings
  const { totalPrice, totalSavings, selectedCount } = useMemo(() => {
    let price = 0;
    let savings = 0;
    let count = 0;

    stores.forEach((store) => {
      store.items.forEach((item) => {
        if (item.isSelected) {
          price += item.price * item.quantity;
          if (item.originalPrice) {
            savings += (item.originalPrice - item.price) * item.quantity;
          }
          count += item.quantity;
        }
      });
    });

    return { totalPrice: price, totalSavings: savings, selectedCount: count };
  }, [stores]);

  const handleItemSelect = useCallback(
    (storeId: string, itemId: string, selected: boolean) => {
      setStores((prev) => {
        const handleStore = prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.map((item) =>
                  item.id === itemId ? { ...item, isSelected: selected } : item
                ),
              }
            : store
        );

        handleStore.forEach((store) => {
          if (store.items.every((item) => item.isSelected)) {
            store.isSelected = true;
          } else {
            store.isSelected = false;
          }
        });

        return handleStore;
      });
    },
    []
  );

  const handleSelectAll = useCallback((selected: boolean) => {
    setStores((prev) =>
      prev.map((store) => ({
        ...store,
        isSelected: selected,
        items: store.items.map((item) => ({
          ...item,
          isSelected: selected,
        })),
      }))
    );
  }, []);

  const handleSelectAllItems = useCallback(
    (storeId: string, selected: boolean) => {
      console.log("storeId", storeId, selected);
      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                isSelected: selected,
                items: store.items.map((item) => ({
                  ...item,
                  isSelected: selected,
                })),
              }
            : store
        )
      );
    },
    []
  );

  const handleItemQuantityChange = useCallback(
    (storeId: string, itemId: string, quantity: number) => {
      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.map((item) =>
                  item.id === itemId ? { ...item, quantity } : item
                ),
              }
            : store
        )
      );
    },
    []
  );

  const handleItemDelete = useCallback((storeId: string, itemId: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? {
              ...store,
              items: store.items.filter((item) => item.id !== itemId),
            }
          : store
      )
    );
  }, []);

  const allItemsSelected =
    stores.length > 0 && stores.every((store) => store.isSelected);

  return (
    <ScreenContainer
      scrollable={false}
      hasBottomTabs={false}
      paddingBottom={0}
      paddingHorizontal={0}
      paddingVertical={0}
      header={
        <Header
          title="Giỏ hàng"
          titleClassName="font-bold"
          leftClassName="w-10"
          className="border-0"
          rightComponent={
            <TouchableOpacity className="relative flex-row justify-end w-10">
              <Image
                source={imagePaths.icMessages}
                style={{ width: 20, height: 20, tintColor: "#393B45" }}
              />
              <View className="absolute -top-3 -right-3">
                <Badge count={9} className="bg-primary" />
              </View>
            </TouchableOpacity>
          }
        />
      }
      backgroundColor="white"
      wrapperClassName="bg-[#EEE]"
    >
      <View className="flex-row justify-between px-5 pt-2 pb-4 bg-white rounded-b-2xl">
        <Pressable
          className="flex-row gap-2 items-center"
          onPress={() => handleSelectAll(!allItemsSelected)}
        >
          <Checkbox
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: "#ccc",
            }}
            color={allItemsSelected ? "#159747" : undefined}
            value={allItemsSelected}
            onValueChange={handleSelectAll}
          />
          <Text className="text-sm font-medium leading-tight text-[#0A0A0A]">
            Tất cả
          </Text>
        </Pressable>
        <TouchableOpacity>
          <Image
            source={imagePaths.icTrash}
            style={{ width: 24, height: 24, tintColor: "#AEAEAE" }}
          />
        </TouchableOpacity>
      </View>
      <FlashList
        data={stores}
        ItemSeparatorComponent={() => <View className="h-[10px]" />}
        renderItem={({ item }) => (
          <ShoppingCartStore
            key={item.id}
            store={item}
            onItemSelect={handleItemSelect}
            onItemQuantityChange={handleItemQuantityChange}
            onItemDelete={handleItemDelete}
            onSelectAllItems={handleSelectAllItems}
          />
        )}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        className="pt-[10px]"
      />
      <View className="absolute right-0 bottom-0 left-0">
        <Footer
          totalPrice={totalPrice}
          totalSavings={totalSavings}
          selectedCount={selectedCount}
        />
      </View>
    </ScreenContainer>
  );
};

export default ShoppingCart;
