import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useProduct } from '../../context/ProductContext';
import { Button } from '../common/Button';

export const ExportSuccessModal: React.FC = () => {
  const { t } = useLanguage();
  const {
    exportSuccessModalVisible,
    lastExportedProduct,
    closeExportModal,
    startNewCataloging,
    setActiveTab,
  } = useProduct();

  if (!lastExportedProduct) return null;

  const handleViewInHistory = () => {
    closeExportModal();
    setActiveTab('history');
  };

  return (
    <Modal
      visible={exportSuccessModalVisible}
      transparent
      animationType="slide"
      onRequestClose={closeExportModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={closeExportModal}
            accessibilityRole="button"
            accessibilityLabel="Close celebration modal"
          >
            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Celebration Icon */}
          <View style={styles.celebrationCircle}>
            <Ionicons name="checkmark-done-circle" size={54} color={COLORS.success} />
          </View>

          {/* Titles */}
          <Text style={styles.titleText}>{t('exportSuccessTitle')}</Text>
          <Text style={styles.subtitleText}>{t('exportSuccessSubtitle')}</Text>

          {/* Catalog ID & QR Code Card */}
          <View style={styles.idCard}>
            <View style={styles.qrRow}>
              <Image
                source={{ uri: lastExportedProduct.qrCodeUrl }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <View style={styles.idInfoCol}>
                <Text style={styles.idLabel}>{t('catalogId')}</Text>
                <Text style={styles.idValue}>{lastExportedProduct.catalogId}</Text>

                <View style={styles.syncStatusRow}>
                  <View style={styles.syncDot} />
                  <Text style={styles.syncText}>ONDC Node Broadcasted</Text>
                </View>
                <View style={styles.syncStatusRow}>
                  <View style={styles.syncDot} />
                  <Text style={styles.syncText}>IndiaHandmade Active</Text>
                </View>
                <View style={styles.syncStatusRow}>
                  <View style={styles.syncDot} />
                  <Text style={styles.syncText}>GeM PSU Catalog Synced</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Product Snapshot */}
          <View style={styles.productSnapshot}>
            <Image
              source={{ uri: lastExportedProduct.image.enhancedUri }}
              style={styles.snapshotThumb}
            />
            <View style={styles.snapshotInfo}>
              <Text style={styles.snapshotTitle} numberOfLines={1}>
                {lastExportedProduct.title}
              </Text>
              <Text style={styles.snapshotPrice}>
                Catalog Price: ₹{lastExportedProduct.pricing.userPrice.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Action CTAs */}
          <Button
            title={t('viewInHistory')}
            onPress={handleViewInHistory}
            variant="primary"
            size="lg"
            iconName="grid"
            style={styles.actionBtn}
          />

          <Button
            title={t('catalogNew')}
            onPress={startNewCataloging}
            variant="secondary"
            size="md"
            iconName="add-circle-outline"
            style={styles.catalogNewBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#BBF7D0',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 16,
  },
  idCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 14,
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrImage: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    marginRight: 14,
  },
  idInfoCol: {
    flex: 1,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  idValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 6,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  productSnapshot: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
    marginBottom: 16,
  },
  snapshotThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 10,
  },
  snapshotInfo: {
    flex: 1,
  },
  snapshotTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  snapshotPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  actionBtn: {
    width: '100%',
    marginBottom: 10,
  },
  catalogNewBtn: {
    width: '100%',
  },
});
