import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ICON_COLOR = '#2e7d32';

const TIPOS_PROPIEDAD = [
  { id: 'residencial', label: 'Residencial (Casa/Departamento)', icon: 'home', price: 1 },
  { id: 'comercial', label: 'Comercial (Oficinas, locales)', icon: 'storefront', price: 1.5 },
  { id: 'industrial', label: 'Industrial/Alimenticio', icon: 'business', price: 2.5 },
];

const TIPOS_PLAGA = [
  { id: 'cucarachas', label: 'Cucarachas', icon: 'bug', price: 1 },
  { id: 'termitas', label: 'Termitas', icon: 'bug-outline', price: 1.5 },
  { id: 'chinches', label: 'Chinches', icon: 'bed', price: 1.2 },
  { id: 'roedores', label: 'Roedores', icon: 'logo-snapchat', price: 1.3 },
  { id: 'hormigas', label: 'Hormigas', icon: 'leaf', price: 0.8 },
  { id: 'moscas', label: 'Moscas/Mosquitos', icon: 'fly', price: 0.7 },
  { id: 'arañas', label: 'Arañas', icon: 'sparkles', price: 0.6 },
  { id: 'otro', label: 'Otro', icon: 'help-circle', price: 1 },
];

const NIVELES_INFESTACION = [
  { id: 'preventivo', label: 'Preventivo', desc: 'Bajo costo, poco químico', icon: 'shield-checkmark', price: 0.5 },
  { id: 'correctivo', label: 'Correctivo', desc: 'Costo medio', icon: 'alert-circle', price: 1 },
  { id: 'choque', label: 'Choque/Infestación severa', desc: 'Alto costo, múltiples visitas', icon: 'warning', price: 2 },
];

const FRECUENCIAS = [
  { id: 'unico', label: 'Servicio único', icon: '1-square', price: 1 },
  { id: 'mensual', label: 'Póliza mensual', icon: 'calendar', price: 0.8 },
  { id: 'bimestral', label: 'Póliza bimestral', icon: 'calendar-outline', price: 0.9 },
];

const HORARIOS = [
  { id: 'matutino', label: 'Matutino (8am - 12pm)', icon: 'sunny', price: 1 },
  { id: 'vespertino', label: 'Vespertino (12pm - 6pm)', icon: 'partly-sunny', price: 1 },
  { id: 'nocturno', label: 'Nocturno (recargo)', icon: 'moon', price: 1.5 },
  { id: 'festivo', label: 'Día festivo (recargo)', icon: 'balloon', price: 2 },
];

const PRODUCTOS = [
  { id: 'tradicional', label: 'Químico tradicional', desc: 'Efectivo y económico', icon: 'flask', price: 0.8 },
  { id: 'ecologico', label: 'Producto ecológico', desc: 'Seguro para mascotas y niños', icon: 'leaf', price: 1.5 },
  { id: 'industrial', label: 'Uso industrial', desc: 'Para grandes superficies', icon: 'business', price: 1.3 },
  { id: 'certificado', label: 'Certificado sanitario', desc: 'Para alimentos y restaurantes', icon: 'medal', price: 2 },
];

interface FormData {
  superficie: string;
  tipoPropiedad: string;
  niveles: string;
  cuartos: string;
  areasVerdes: boolean;
  tipoPlaga: string;
  nivelInfestacion: string;
  codigoPostal: string;
  frecuencia: string;
  horario: string;
  producto: string;
}

export default function Cotizador() {
  const [step, setStep] = useState(1);
const [formData, setFormData] = useState<FormData>({
    superficie: '',
    tipoPropiedad: '',
    niveles: '1',
    cuartos: '',
    areasVerdes: false,
    tipoPlaga: '',
    nivelInfestacion: '',
    codigoPostal: '',
    frecuencia: '',
    horario: '',
    producto: '',
  });

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const estimatedCost = calculateCost();

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Paso 1: Datos del Inmueble</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Superficie (m²)</Text>
        <TextInput
          style={styles.input}
          value={formData.superficie}
          onChangeText={(v) => updateField('superficie', v)}
          placeholder="Ej: 120"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tipo de propiedad</Text>
        {TIPOS_PROPIEDAD.map((tipo) => (
          <TouchableOpacity
            key={tipo.id}
            style={[
              styles.radioOption,
              formData.tipoPropiedad === tipo.id && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('tipoPropiedad', tipo.id)}
          >
            <Ionicons
              name={tipo.icon as any}
              size={22}
              color={formData.tipoPropiedad === tipo.id ? ICON_COLOR : '#888'}
              style={styles.optionIcon}
            />
            <Text style={styles.radioLabel}>{tipo.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Número de niveles/plantas</Text>
        <TextInput
          style={styles.input}
          value={formData.niveles}
          onChangeText={(v) => updateField('niveles', v)}
          placeholder="Ej: 1"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Número de cuartos</Text>
        <TextInput
          style={styles.input}
          value={formData.cuartos}
          onChangeText={(v) => updateField('cuartos', v)}
          placeholder="Ej: 3"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <TouchableOpacity
          style={[
            styles.checkboxOption,
            formData.areasVerdes && styles.checkboxOptionSelected,
          ]}
          onPress={() => updateField('areasVerdes', !formData.areasVerdes)}
        >
          <Ionicons
            name="leaf"
            size={22}
            color={formData.areasVerdes ? ICON_COLOR : '#888'}
            style={styles.optionIcon}
          />
          <Text style={styles.checkboxLabel}>¿Cuenta con áreas verdes/jardines?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Paso 2: Especificaciones de la Plaga</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Tipo de plaga</Text>
        {TIPOS_PLAGA.map((plaga) => (
          <TouchableOpacity
            key={plaga.id}
            style={[
              styles.radioOption,
              formData.tipoPlaga === plaga.id && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('tipoPlaga', plaga.id)}
          >
            <Ionicons
              name={plaga.icon as any}
              size={22}
              color={formData.tipoPlaga === plaga.id ? ICON_COLOR : '#888'}
              style={styles.optionIcon}
            />
            <Text style={styles.radioLabel}>{plaga.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nivel de infestación</Text>
        {NIVELES_INFESTACION.map((nivel) => (
          <TouchableOpacity
            key={nivel.id}
            style={[
              styles.radioOption,
              formData.nivelInfestacion === nivel.id && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('nivelInfestacion', nivel.id)}
          >
            <Ionicons
              name={nivel.icon as any}
              size={22}
              color={formData.nivelInfestacion === nivel.id ? ICON_COLOR : '#888'}
              style={styles.optionIcon}
            />
            <View>
              <Text style={styles.radioLabel}>{nivel.label}</Text>
              <Text style={styles.radioDesc}>{nivel.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Paso 3: Logística y Frecuencia</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Código Postal</Text>
        <TextInput
          style={styles.input}
          value={formData.codigoPostal}
          onChangeText={(v) => updateField('codigoPostal', v)}
          placeholder="Ej: 06600"
          keyboardType="numeric"
          maxLength={5}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Periodicidad del servicio</Text>
        {FRECUENCIAS.map((freq) => (
          <TouchableOpacity
            key={freq.id}
            style={[
              styles.radioOption,
              formData.frecuencia === freq.id && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('frecuencia', freq.id)}
          >
            <Ionicons
              name={freq.icon as any}
              size={22}
              color={formData.frecuencia === freq.id ? ICON_COLOR : '#888'}
              style={styles.optionIcon}
            />
            <Text style={styles.radioLabel}>{freq.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Horario del servicio</Text>
        {HORARIOS.map((hor) => (
          <TouchableOpacity
            key={hor.id}
            style={[
              styles.radioOption,
              formData.horario === hor.id && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('horario', hor.id)}
          >
            <Ionicons
              name={hor.icon as any}
              size={22}
              color={formData.horario === hor.id ? ICON_COLOR : '#888'}
              style={styles.optionIcon}
            />
            <Text style={styles.radioLabel}>{hor.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Paso 4: Productos a Utilizar</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Tipo de producto</Text>
        {PRODUCTOS.map((prod) => (
          <TouchableOpacity
            key={prod.id}
            style={[
              styles.radioOption,
              formData.producto === prod.id && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('producto', prod.id)}
          >
            <Ionicons
              name={prod.icon as any}
              size={22}
              color={formData.producto === prod.id ? ICON_COLOR : '#888'}
              style={styles.optionIcon}
            />
            <View>
              <Text style={styles.radioLabel}>{prod.label}</Text>
              <Text style={styles.radioDesc}>{prod.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleRequestQuote = () => {
    Alert.alert(
      'Cotización Solicitada',
      `Gracias por tu interés. Te cotizamos $${estimatedCost} MXN.\n\nNos pondremos en contacto contigo pronto.`,
      [{ text: 'OK', onPress: () => setStep(1) }]
    );
  };

  const calculateCost = () => {
    const superficie = parseFloat(formData.superficie) || 0;
    const niveles = parseFloat(formData.niveles) || 1;
    const areasVerdes = formData.areasVerdes ? 1.2 : 1;

    const tipoPropiedadPrice = TIPOS_PROPIEDAD.find((t) => t.id === formData.tipoPropiedad)?.price || 1;
    const tipoPlagaPrice = TIPOS_PLAGA.find((t) => t.id === formData.tipoPlaga)?.price || 1;
    const nivelPrice = NIVELES_INFESTACION.find((n) => n.id === formData.nivelInfestacion)?.price || 1;
    const frecuenciaPrice = FRECUENCIAS.find((f) => f.id === formData.frecuencia)?.price || 1;
    const horarioPrice = HORARIOS.find((h) => h.id === formData.horario)?.price || 1;
    const productoPrice = PRODUCTOS.find((p) => p.id === formData.producto)?.price || 1;

    const basePrice = 350;
    const m2Price = 15;
    const totalM2 = superficie * m2Price * niveles * tipoPropiedadPrice * areasVerdes;
    const multiplier = tipoPlagaPrice * nivelPrice * frecuenciaPrice * horarioPrice * productoPrice;
    
    return Math.round(totalM2 * multiplier + basePrice);
  };

  const calculateCost = () => {
    const superficie = parseFloat(formData.superficie) || 0;
    const niveles = parseFloat(formData.niveles) || 1;
    const areasVerdes = formData.areasVerdes ? 1.2 : 1;

    const tipoPropiedadPrice = TIPOS_PROPIEDAD.find((t) => t.id === formData.tipoPropiedad)?.price || 1;
    const tipoPlagaPrice = TIPOS_PLAGA.find((t) => t.id === formData.tipoPlaga)?.price || 1;
    const nivelPrice = NIVELES_INFESTACION.find((n) => n.id === formData.nivelInfestacion)?.price || 1;
    const frecuenciaPrice = FRECUENCIAS.find((f) => f.id === formData.frecuencia)?.price || 1;
    const horarioPrice = HORARIOS.find((h) => h.id === formData.horario)?.price || 1;
    const productoPrice = PRODUCTOS.find((p) => p.id === formData.producto)?.price || 1;

    const basePrice = 350;
    const m2Price = 15;
    const totalM2 = superficie * m2Price * niveles * tipoPropiedadPrice * areasVerdes;
    const multiplier = tipoPlagaPrice * nivelPrice * frecuenciaPrice * horarioPrice * productoPrice;
    
    return Math.round(totalM2 * multiplier + basePrice);
  };

  const renderResumen = () => {
    const tipoPropiedadLabel =
      TIPOS_PROPIEDAD.find((t) => t.id === formData.tipoPropiedad)?.label || '-';
    const tipoPlagaLabel =
      TIPOS_PLAGA.find((t) => t.id === formData.tipoPlaga)?.label || '-';
    const nivelLabel =
      NIVELES_INFESTACION.find((n) => n.id === formData.nivelInfestacion)?.label || '-';
    const frecuenciaLabel =
      FRECUENCIAS.find((f) => f.id === formData.frecuencia)?.label || '-';
    const horarioLabel =
      HORARIOS.find((h) => h.id === formData.horario)?.label || '-';
    const productoLabel =
      PRODUCTOS.find((p) => p.id === formData.producto)?.label || '-';

    const costo = estimatedCost;

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Resumen de Cotización</Text>

        <View style={styles.costCard}>
          <Text style={styles.costLabel}>Costo estimado</Text>
          <Text style={styles.costValue}>${costo} MXN</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.resumenCard}>
          <ResumenItem label="Superficie" value={`${formData.superficie || '-'} m²`} />
          <ResumenItem label="Tipo de propiedad" value={tipoPropiedadLabel} />
          <ResumenItem label="Niveles" value={formData.niveles || '-'} />
          <ResumenItem label="Cuartos" value={formData.cuartos || '-'} />
          <ResumenItem
            label="Áreas verdes"
            value={formData.areasVerdes ? 'Sí' : 'No'}
          />
          <View style={styles.divider} />
          <ResumenItem label="Tipo de plaga" value={tipoPlagaLabel} />
          <ResumenItem label="Nivel de infestación" value={nivelLabel} />
          <View style={styles.divider} />
          <ResumenItem label="Código Postal" value={formData.codigoPostal || '-'} />
          <ResumenItem label="Frecuencia" value={frecuenciaLabel} />
          <ResumenItem label="Horario" value={horarioLabel} />
          <View style={styles.divider} />
          <ResumenItem label="Producto" value={productoLabel} />
        </View>
      </View>
    );
  };

  const isStepComplete = () => {
    if (step === 1) {
      return Boolean(
        formData?.superficie &&
        formData?.tipoPropiedad &&
        formData?.niveles &&
        formData?.cuartos
      );
    }
    if (step === 2) {
      return Boolean(formData?.tipoPlaga && formData?.nivelInfestacion);
    }
    if (step === 3) {
      return Boolean(
        formData?.codigoPostal &&
        formData?.codigoPostal?.length === 5 &&
        formData?.frecuencia &&
        formData?.horario
      );
    }
    if (step === 4) {
      return Boolean(formData?.producto);
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cotizador de Fumigación</Text>
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                step >= s && styles.stepDotActive,
                step === s && styles.stepDotCurrent,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderResumen()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={prevStep}
          >
            <Text style={styles.btnTextSecondary}>
              {step === 5 ? 'Volver' : 'Anterior'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btnPrimary,
            !isStepComplete() && styles.btnDisabled,
            step === 1 && styles.btnFullWidth,
          ]}
          onPress={step === 5 ? handleRequestQuote : nextStep}
          disabled={!isStepComplete()}
        >
          <Text style={styles.btnTextPrimary}>
            {step === 4 ? 'Ver Resumen' : step === 5 ? `Solicitar - $${estimatedCost} MXN` : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ResumenItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resumenItem}>
      <Text style={styles.resumenLabel}>{label}</Text>
      <Text style={styles.resumenValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  stepDotCurrent: {
    backgroundColor: '#fff',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  stepContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  radioOptionSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  optionIcon: {
    marginRight: 12,
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
  radioDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  checkboxOptionSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
  },
  resumenCard: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resumenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  resumenLabel: {
    fontSize: 15,
    color: '#666',
  },
  resumenValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  costCard: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  costLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  costValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnFullWidth: {
    flex: 1,
  },
  btnPrimary: {
    backgroundColor: '#2e7d32',
  },
  btnSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  btnDisabled: {
    backgroundColor: '#a5d6a7',
  },
  btnTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnTextSecondary: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});