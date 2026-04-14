import React from "react";
import { View, Text, StyleSheet} from "react-native";

type BulletListItems = {
    items: Array<String>
}

const BulletList = ({items}: BulletListItems) => {
    return (
        <View style={styles.ul}>
            {items.map((item, number) => (
                <View style={styles.li}>
                    <Text style={styles.liBullet}>• </Text>
                    <Text style={styles.liText}>{item}</Text>
                </View>
            )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    ul: {
        flexDirection: "column",
        alignItems: "flex-start"
    },
    li: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    liBullet: {
        fontWeight: "bold",
        fontSize: 32
    },
    liText: {
        fontSize: 24
    }
})

export default BulletList;