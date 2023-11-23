import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, View } from 'react-native';
import { exportCombined } from '../../apis/exportarApi';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import base64 from 'base-64';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Componente botón para exportar y compartir un archivo Excel.
 * 
 * Este componente facilita la descarga y compartición de un archivo Excel 
 * basado en una entrada específica, haciendo uso de la API para exportar datos.
 * 
 * @param {Object} props 
 * @param {number} props.entryId - ID de la entrada a exportar.
 * @param {string} [props.buttonText="Exportar Excel"] - Texto a mostrar en el botón.
 * @returns {JSX.Element}
 */

function ShareExcelButton({ entryId, buttonText = "Exportar Excel" }) {
    
    /**
     * Convierte un ArrayBuffer en una cadena Base64.
     * 
     * @param {ArrayBuffer} buffer - El buffer a convertir.
     * @returns {string} - Cadena en formato Base64.
     */
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return base64.encode(binary);
    }
    /**
     * Función para descargar y compartir el archivo Excel.
     */
    const downloadAndShare = async () => {
        try {
            const data = await exportCombined(entryId);

            if (!data) {
                throw new Error("No se recibieron datos del servidor.");
            }

            const base64Data = arrayBufferToBase64(data);
            const filename = `Entrada_${entryId}.xlsx`;
            const uri = FileSystem.documentDirectory + filename;
            await FileSystem.writeAsStringAsync(uri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Error', 'La compartición no está disponible en esta plataforma.');
                return;
            }

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error("Error al descargar o compartir el archivo:", error);
            Alert.alert('Error', 'Error al descargar o compartir el archivo.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={downloadAndShare}>
                <Text style={styles.buttonText}>{buttonText}</Text>
                <Icon name="upload-file" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: '37%',
        padding: 10,
        backgroundColor: "#4CAF50",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        marginRight: 10,
    }
});

export default ShareExcelButton;
