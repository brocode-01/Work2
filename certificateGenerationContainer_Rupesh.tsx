tsx
Copy code
import React, { useRef, useEffect, useState } from 'react';
import { View, Button, Platform } from 'react-native';
import { Canvas, Image as CanvasImage } from 'react-native-canvas';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App(): JSX.Element {
  const canvasRef = useRef<Canvas | null>(null);
  const [certificateDetails, setCertificateDetails] = useState<{ name: string; date: string }>({
    name: 'Participant Name',
    date: '2024-05-30',
  });

  useEffect(() => {
    const drawCertificate = async (): Promise<void> => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const img = new CanvasImage(canvas);
      img.src = 'https://your-server.com/certificate_template.png'; // Replace with your actual template URL
      img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0, 800, 600);

        // Add participant's name
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(certificateDetails.name, 200, 300);

        // Add completion date
        ctx.font = '20px Arial';
        ctx.fillText(`Completion Date: ${certificateDetails.date}`, 200, 350);
      });
    };

    drawCertificate();
  }, [certificateDetails]);

  const saveAndShareJson = async (): Promise<void> => {
    const jsonDetails = JSON.stringify(certificateDetails);
    const fileUri = `${FileSystem.documentDirectory}certificateDetails.json`;

    await FileSystem.writeAsStringAsync(fileUri, jsonDetails, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (Platform.OS === 'web') {
      // Create a download link for the web
      const link = document.createElement('a');
      link.href = `data:application/json;charset=utf-8,${encodeURIComponent(jsonDetails)}`;
      link.download = 'certificateDetails.json';
      link.click();
    } else {
      // Share on mobile
      await Sharing.shareAsync(fileUri);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Canvas ref={canvasRef} style={{ width: 800, height: 600 }} />
      <Button title="Save and Share JSON" onPress={saveAndShareJson} />
    </View>
  );
}
