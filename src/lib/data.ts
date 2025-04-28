
export interface Plaza {
  departamento: string;
  municipio: string;
  vacantes: number;
  prioridad?: number;
}

export interface Aspirante {
  puesto: number;
  puntaje: number;
  cedula: string;
  nombre: string;
  plazaDeseada: string;
}

// Datos iniciales de plazas
export const plazas: Plaza[] = [
  { departamento: "Antioquia", municipio: "Puerto Berrío", vacantes: 1 },
  { departamento: "Santander", municipio: "Bucaramanga", vacantes: 1 },
  { departamento: "Tolima", municipio: "San Sebastián De Mariquita", vacantes: 1 },
  { departamento: "Antioquia", municipio: "Rionegro", vacantes: 9 },
  { departamento: "Valle del Cauca", municipio: "Palmira", vacantes: 16 },
  { departamento: "Tolima", municipio: "Flandes", vacantes: 1 },
  { departamento: "Casanare", municipio: "Yopal", vacantes: 2 },
  { departamento: "Atlántico", municipio: "Soledad", vacantes: 7 },
  { departamento: "Quindío", municipio: "Armenia", vacantes: 4 },
  { departamento: "Tolima", municipio: "Ibagué", vacantes: 5 },
  { departamento: "Nariño", municipio: "Tumaco", vacantes: 1 },
  { departamento: "Antioquia", municipio: "Amalfi", vacantes: 1 },
  { departamento: "Sucre", municipio: "Santiago De Tolú", vacantes: 1 },
  { departamento: "Bolívar", municipio: "Magangué", vacantes: 1 },
  { departamento: "Norte de Santander", municipio: "Ocaña", vacantes: 1 },
  { departamento: "Chocó", municipio: "Nuquí", vacantes: 2 },
  { departamento: "Casanare", municipio: "Paz De Ariporo", vacantes: 1 },
  { departamento: "Antioquia", municipio: "Remedios", vacantes: 1 },
  { departamento: "Archipiélago de San Andrés, Providencia y Santa Catalina", municipio: "San Andrés", vacantes: 2 },
  { departamento: "Vaupés", municipio: "Mitú", vacantes: 2 },
  { departamento: "Norte de Santander", municipio: "Cúcuta", vacantes: 7 },
  { departamento: "Chocó", municipio: "Condoto", vacantes: 1 },
  { departamento: "Cauca", municipio: "Guapí", vacantes: 2 },
  { departamento: "Bolívar", municipio: "Cartagena De Indias", vacantes: 1 },
  { departamento: "Nariño", municipio: "Pasto", vacantes: 1 },
  { departamento: "Chocó", municipio: "Quibdó", vacantes: 1 },
  { departamento: "Arauca", municipio: "Arauca", vacantes: 1 },
  { departamento: "Amazonas", municipio: "Leticia", vacantes: 1 },
  { departamento: "Risaralda", municipio: "Pereira", vacantes: 2 },
  { departamento: "Magdalena", municipio: "Santa Marta", vacantes: 2 },
  { departamento: "Cundinamarca", municipio: "Bogotá D.C.", vacantes: 11 },
  { departamento: "Cesar", municipio: "Valledupar", vacantes: 2 },
  { departamento: "Valle del Cauca", municipio: "Buenaventura", vacantes: 1 },
  { departamento: "Meta", municipio: "Villavicencio", vacantes: 4 }
];

// Datos iniciales de aspirantes
export const aspirantes: Aspirante[] = [
  { puesto: 1, puntaje: 88.18, cedula: "1082982133", nombre: "DORIS MARIA JIMENEZ OROZCO", plazaDeseada: "" },
  { puesto: 2, puntaje: 85.21, cedula: "1085286283", nombre: "ESTEBAN MAURICIO HERRERA DIAZ", plazaDeseada: "" },
  { puesto: 3, puntaje: 84.46, cedula: "1094953402", nombre: "SANTIAGO PRIETO GOMEZ", plazaDeseada: "" },
  { puesto: 4, puntaje: 83.71, cedula: "29108823", nombre: "AURA PRISCILA ESPINOSA LASSO", plazaDeseada: "" },
  { puesto: 5, puntaje: 83.71, cedula: "1118556362", nombre: "LEIDY PAOLA MORENO BAYONA", plazaDeseada: "" },
  { puesto: 6, puntaje: 82.99, cedula: "1101814897", nombre: "JOSE ALFREDO LUNA CHAJIN", plazaDeseada: "" },
  { puesto: 7, puntaje: 82.96, cedula: "1192890646", nombre: "NAIDEE ROCIO RANGEL ANGULO", plazaDeseada: "" },
  { puesto: 8, puntaje: 82.90, cedula: "1140891729", nombre: "VANESSA MORALES MEJIA", plazaDeseada: "" },
  { puesto: 9, puntaje: 82.28, cedula: "38553415", nombre: "NERSY ARANA LOZADA", plazaDeseada: "" },
  { puesto: 10, puntaje: 82.24, cedula: "1042446734", nombre: "MILEYDIS DUNCAN DE AVILA", plazaDeseada: "" },
  { puesto: 11, puntaje: 82.24, cedula: "1002955695", nombre: "DORA STELLA TORRES HURTADO", plazaDeseada: "" },
  { puesto: 12, puntaje: 82.21, cedula: "1140837304", nombre: "ANGELICA MARIA RUIZ GUIO", plazaDeseada: "" },
  { puesto: 13, puntaje: 82.21, cedula: "49721909", nombre: "RUBIS PAOLA GRACIA PEREZ", plazaDeseada: "" },
  { puesto: 14, puntaje: 82.21, cedula: "10842255683", nombre: "BYRON FELIPE NARVAEZ GRANDA", plazaDeseada: "" },
  { puesto: 15, puntaje: 82.18, cedula: "1233189629", nombre: "ANGIE VANESSA MENESES GUERRERO", plazaDeseada: "" },
  { puesto: 16, puntaje: 81.53, cedula: "1001635722", nombre: "ROMER DARIO GUZMAN ARTEAGA", plazaDeseada: "" },
  { puesto: 17, puntaje: 81.53, cedula: "1113638106", nombre: "MARCELA ROMERO SANCHEZ", plazaDeseada: "" },
  { puesto: 18, puntaje: 81.53, cedula: "1031149634", nombre: "CRISTIAN ANDREY MARTINEZ URQUIJO", plazaDeseada: "" },
  { puesto: 19, puntaje: 81.49, cedula: "12996873", nombre: "JAIME ALVARO DELGADO VILLOTA", plazaDeseada: "" },
  { puesto: 20, puntaje: 81.46, cedula: "1092387051", nombre: "HANER JHOAN LEAL CHACON", plazaDeseada: "" },
  { puesto: 21, puntaje: 81.46, cedula: "1001133325", nombre: "JUANA ZULETA GOMEZ", plazaDeseada: "" },
  { puesto: 22, puntaje: 81.46, cedula: "36611339", nombre: "ADRIANA ISABEL BONILLA GARCIA", plazaDeseada: "" },
  { puesto: 23, puntaje: 81.46, cedula: "1053609398", nombre: "DIANA CAROLINA RODRIGUEZ ZAMBRANO", plazaDeseada: "" },
  { puesto: 24, puntaje: 81.40, cedula: "73185967", nombre: "FERNANDO ALBERTO PELUFFO FERNANDEZ", plazaDeseada: "" },
  { puesto: 25, puntaje: 80.81, cedula: "1063483206", nombre: "KAREN YULIETH MARTINEZ MEJIA", plazaDeseada: "" },
  { puesto: 26, puntaje: 80.81, cedula: "1059990252", nombre: "NILSON ANDRES CHARA CANDELA", plazaDeseada: "" },
  { puesto: 27, puntaje: 80.78, cedula: "1088002612", nombre: "JHON EDILSON HOYOS MORALES", plazaDeseada: "" },
  { puesto: 28, puntaje: 80.78, cedula: "1004189867", nombre: "LAURA VANESSA OLIVA MOLANO", plazaDeseada: "" },
  { puesto: 29, puntaje: 80.78, cedula: "1085309432", nombre: "EVELYN LISBETH GOMEZ ESCOBAR", plazaDeseada: "" },
  { puesto: 30, puntaje: 80.78, cedula: "1005025120", nombre: "ANGEL CAMILO VEGA MENDEZ", plazaDeseada: "" },
  { puesto: 31, puntaje: 80.78, cedula: "72279631", nombre: "HANS CARLOS LOZADA GUZMAN", plazaDeseada: "" },
  { puesto: 32, puntaje: 80.74, cedula: "1002029159", nombre: "DANIEL EDUARDO ORTEGA FERNANDEZ", plazaDeseada: "" },
  { puesto: 33, puntaje: 80.74, cedula: "35116294", nombre: "LUZ ESTELA MONCADA FUENTES", plazaDeseada: "" },
  { puesto: 34, puntaje: 80.74, cedula: "1116867393", nombre: "YUCENT GUILLERMO REALPE OSORIO", plazaDeseada: "" },
  { puesto: 35, puntaje: 80.74, cedula: "1007180368", nombre: "MARIA ALEJANDRA AREVALO ESTRADA", plazaDeseada: "" },
  { puesto: 36, puntaje: 80.74, cedula: "1113623051", nombre: "JUAN DAVID PERDOMO ROJAS", plazaDeseada: "" },
  { puesto: 37, puntaje: 80.68, cedula: "1030602626", nombre: "CAMILO ANDRES PEÑUELA HUERTAS", plazaDeseada: "" },
  { puesto: 38, puntaje: 80.09, cedula: "1065572618", nombre: "CRISTIAN RAFAEL BOLAÑO MOSCOTE", plazaDeseada: "" },
  { puesto: 39, puntaje: 80.09, cedula: "33625586", nombre: "PAULA ANDREA ARANGO ALZATE", plazaDeseada: "" },
  { puesto: 40, puntaje: 80.06, cedula: "1143379728", nombre: "SANDRI TATIANA ALEAN PEREZ", plazaDeseada: "" },
  { puesto: 41, puntaje: 80.06, cedula: "66904968", nombre: "CARMEN ELENA CHAVES GUAÑA", plazaDeseada: "" },
  { puesto: 42, puntaje: 80.06, cedula: "1152937320", nombre: "ANA MILENA HERNANDEZ OÑATE", plazaDeseada: "" },
  { puesto: 43, puntaje: 80.06, cedula: "66761354", nombre: "CLAUDIA MARYSOL BUITRAGO SAAVEDRA", plazaDeseada: "" },
  { puesto: 44, puntaje: 80.06, cedula: "1094936353", nombre: "JHON STEVEN MONTES HENKER", plazaDeseada: "" },
  { puesto: 45, puntaje: 80.03, cedula: "1099376568", nombre: "CARMEN ELIANA VESGA REY", plazaDeseada: "" },
  { puesto: 46, puntaje: 80.03, cedula: "88191910", nombre: "FREDDY ENRIQUE ESPINOSA MUÑOZ", plazaDeseada: "" },
  { puesto: 47, puntaje: 80.03, cedula: "14298181", nombre: "GUILLERMO ALEJANDRO BOTERO LOPEZ", plazaDeseada: "" },
  { puesto: 48, puntaje: 80.03, cedula: "1090174416", nombre: "MAURICIO RIOS ORTEGA", plazaDeseada: "" },
  { puesto: 49, puntaje: 80.03, cedula: "1097388916", nombre: "CAROLINA RIVEROS", plazaDeseada: "" },
  { puesto: 50, puntaje: 79.99, cedula: "1143334397", nombre: "GUADALUPE ALVAREZ MARTINEZ", plazaDeseada: "" },
  { puesto: 51, puntaje: 79.99, cedula: "33238369", nombre: "CLAUDIA REGINA AMELL PEREZ", plazaDeseada: "" },
  { puesto: 52, puntaje: 79.99, cedula: "1114824310", nombre: "LEIDY JOHANA CASTRO HERNANDEZ", plazaDeseada: "" },
  { puesto: 53, puntaje: 79.99, cedula: "1010090188", nombre: "IVAN DARIO TORRES VEGA", plazaDeseada: "" },
  { puesto: 54, puntaje: 79.99, cedula: "9735661", nombre: "JOSE LUIS BOHORQUEZ RAMOS", plazaDeseada: "" },
  { puesto: 55, puntaje: 79.96, cedula: "1065593536", nombre: "ZULIBETH CAROLINA QUIROZ RODRIGUEZ", plazaDeseada: "" },
  { puesto: 56, puntaje: 79.34, cedula: "1094915303", nombre: "ANDRES JULIAN OSORIO ECHEVERI", plazaDeseada: "" },
  { puesto: 57, puntaje: 79.31, cedula: "1045670114", nombre: "LUIS EDUARDO CORRALES FIGUEROA", plazaDeseada: "" },
  { puesto: 58, puntaje: 79.31, cedula: "1192758781", nombre: "JUAN MANUEL VILLA CANO", plazaDeseada: "" },
  { puesto: 59, puntaje: 79.31, cedula: "1090519882", nombre: "ANA MARIA ORTIZ OSPINO", plazaDeseada: "" },
  { puesto: 60, puntaje: 79.31, cedula: "1002001081", nombre: "JESUS ELIAS SAUMETH GARAVITO", plazaDeseada: "" },
  { puesto: 61, puntaje: 79.31, cedula: "1001947567", nombre: "ARIEL ANDRES ARTETA ESCORCIA", plazaDeseada: "" },
  { puesto: 62, puntaje: 79.31, cedula: "1100396622", nombre: "GINA PAOLA GARRIDO DIAZ", plazaDeseada: "" },
  { puesto: 63, puntaje: 79.31, cedula: "87215743", nombre: "EDGAR HERNAN LONDOÑO AVILA", plazaDeseada: "" },
  { puesto: 64, puntaje: 79.28, cedula: "87453609", nombre: "EULER REMIGIO BASANTE MORA", plazaDeseada: "" },
  { puesto: 65, puntaje: 79.28, cedula: "1115065872", nombre: "FERNANDO ALBERTO GOMEZ CATAÑO", plazaDeseada: "" },
  { puesto: 66, puntaje: 79.28, cedula: "1098663913", nombre: "LAURA GISELA GUARGUATI GUARGU", plazaDeseada: "" },
  { puesto: 67, puntaje: 79.28, cedula: "1036966459", nombre: "JULIANA OSPINA GOMEZ", plazaDeseada: "" },
  { puesto: 68, puntaje: 79.28, cedula: "1022398599", nombre: "LAURA ESMERALDA CABRERA LLANOS", plazaDeseada: "" },
  { puesto: 69, puntaje: 79.28, cedula: "1084551967", nombre: "DANIELA SUSANA MARTINEZ SILVA", plazaDeseada: "" },
  { puesto: 70, puntaje: 79.24, cedula: "1015405787", nombre: "MARCELA SANTAMARIA RUIZ", plazaDeseada: "" },
  { puesto: 71, puntaje: 79.24, cedula: "1086105026", nombre: "DEYFA MERCEDES PALACIOS PORTILLO", plazaDeseada: "" },
  { puesto: 72, puntaje: 79.24, cedula: "79730733", nombre: "HAROL ALEXANDER CORREDOR TORRES", plazaDeseada: "" },
  { puesto: 73, puntaje: 79.24, cedula: "1010126853", nombre: "JOSE ARMANDO ORTEGA BARBOSA", plazaDeseada: "" },
  { puesto: 74, puntaje: 79.24, cedula: "31432182", nombre: "LINA ISABEL MARIN MARIN", plazaDeseada: "" },
  { puesto: 75, puntaje: 79.21, cedula: "1085306538", nombre: "JULLY DANIELA CHAPAL MALLAMA", plazaDeseada: "" },
  { puesto: 76, puntaje: 79.21, cedula: "1143394962", nombre: "OMNY ALBERTO MARTINEZ MEZA", plazaDeseada: "" },
  { puesto: 77, puntaje: 79.21, cedula: "1003265215", nombre: "LUISA FERNANDA ALVARADO DOMINGO", plazaDeseada: "" },
  { puesto: 78, puntaje: 79.21, cedula: "1054571429", nombre: "CARLOS IVES GUTIERREZ LIZARAZO", plazaDeseada: "" },
  { puesto: 79, puntaje: 79.21, cedula: "1116041326", nombre: "NORYDA BLANCO ALVAREZ", plazaDeseada: "" },
  { puesto: 80, puntaje: 78.62, cedula: "1005910678", nombre: "JUAN SEBASTIAN AMORTEGUI BUITRA", plazaDeseada: "" },
  { puesto: 81, puntaje: 78.62, cedula: "1065825263", nombre: "GERALDINE PAOLA ROMERO DIAZ", plazaDeseada: "" },
  { puesto: 82, puntaje: 78.59, cedula: "32741656", nombre: "SHEILA ESTHER ROMAN GUARDIAS", plazaDeseada: "" },
  { puesto: 83, puntaje: 78.59, cedula: "1094935929", nombre: "DAHYANE ANDREA SIERRA ACOSTA", plazaDeseada: "" },
  { puesto: 84, puntaje: 78.56, cedula: "71193255", nombre: "LUIS ENDER MURILLO MACHADO", plazaDeseada: "" },
  { puesto: 85, puntaje: 78.56, cedula: "1053842440", nombre: "CARLOS DAVID VALENCIA ERASO", plazaDeseada: "" },
  { puesto: 86, puntaje: 78.56, cedula: "64894292", nombre: "SAMIRA ESTELLA RIVERO VASQUEZ", plazaDeseada: "" },
  { puesto: 87, puntaje: 78.56, cedula: "1005625549", nombre: "CESAR ANDRES PEREZ CAMPO", plazaDeseada: "" },
  { puesto: 88, puntaje: 78.56, cedula: "1118303077", nombre: "NANCY YULIETH RIVERA RAMOS", plazaDeseada: "" },
  { puesto: 89, puntaje: 78.56, cedula: "1110568387", nombre: "LUISA FERNANDA NIÑO PAEZ", plazaDeseada: "" },
  { puesto: 90, puntaje: 78.56, cedula: "1086363586", nombre: "FABIOLA NATALI GUERRERO AREVALO", plazaDeseada: "" },
  { puesto: 91, puntaje: 78.56, cedula: "1018471628", nombre: "ANDRES FELIPE OTALORA ROMERO", plazaDeseada: "" },
  { puesto: 92, puntaje: 78.53, cedula: "39455048", nombre: "MARIA MARCELA GIL SOTO", plazaDeseada: "" },
  { puesto: 93, puntaje: 78.53, cedula: "1066744396", nombre: "DULEYS CHAVES GARCES", plazaDeseada: "" },
  { puesto: 94, puntaje: 78.53, cedula: "1089748496", nombre: "JOSE LUIS MOLINA OSORIO", plazaDeseada: "" },
  { puesto: 95, puntaje: 78.53, cedula: "1065610715", nombre: "DANIXA BEATRIZ PEREZ ROBALLO", plazaDeseada: "" },
  { puesto: 96, puntaje: 78.53, cedula: "1090525531", nombre: "BRENDA ALEJANDRA VILLAMIZAR MEDINA", plazaDeseada: "" },
  { puesto: 97, puntaje: 78.53, cedula: "1116552641", nombre: "DIANA ISABEL CAMARGO MOLANO", plazaDeseada: "" },
  { puesto: 98, puntaje: 78.53, cedula: "1098736332", nombre: "SILVIA JOHANA VILLAMIZAR SANABRIA", plazaDeseada: "" },
  { puesto: 99, puntaje: 78.53, cedula: "1042420525", nombre: "JULIO CESAR PEREZ ZAPATA", plazaDeseada: "" },
  { puesto: 100, puntaje: 78.53, cedula: "30509844", nombre: "ELIZABETH VALENZUELA RAMOS", plazaDeseada: "" },
  { puesto: 101, puntaje: 78.53, cedula: "1083557108", nombre: "DANIEL ALBERTO FERNANDEZ JUVINAL", plazaDeseada: "" },
  { puesto: 102, puntaje: 78.53, cedula: "1129522698", nombre: "ALVARO ANDRES BERMEJO GARCIA", plazaDeseada: "" },
  { puesto: 103, puntaje: 78.53, cedula: "13744931", nombre: "LUIS ALBEIRO OCHOA GARCIA", plazaDeseada: "" },
  { puesto: 104, puntaje: 78.53, cedula: "68294171", nombre: "CLAUDIA ROCIO MORALES PINZON", plazaDeseada: "" }
];

// Helper function to get user from cedula
export const getAspiranteByCredentials = (cedula: string, opec: string): Aspirante | undefined => {
  // Verify OPEC number
  if (opec !== "209961") {
    return undefined;
  }
  
  console.log("Buscando aspirante con cédula:", cedula);
  
  // Find user by cedula - asegurando que la comparación sea como string
  const foundAspirante = aspirantes.find(aspirante => {
    const aspiranteCedula = String(aspirante.cedula).trim();
    const searchCedula = String(cedula).trim();
    const match = aspiranteCedula === searchCedula;
    console.log(`Comparando: "${aspiranteCedula}" === "${searchCedula}" => ${match}`);
    return match;
  });
  
  console.log("Aspirante encontrado:", foundAspirante);
  
  return foundAspirante;
};

// Helper function to save data to local storage
export const saveToLocalStorage = () => {
  localStorage.setItem('plazas', JSON.stringify(plazas));
  localStorage.setItem('aspirantes', JSON.stringify(aspirantes));
};

// Helper function to load data from local storage
export const loadFromLocalStorage = () => {
  const plazasData = localStorage.getItem('plazas');
  const aspirantesData = localStorage.getItem('aspirantes');
  
  if (plazasData) {
    const parsedPlazas = JSON.parse(plazasData);
    plazas.splice(0, plazas.length, ...parsedPlazas);
  }
  
  if (aspirantesData) {
    const parsedAspirantes = JSON.parse(aspirantesData);
    aspirantes.splice(0, aspirantes.length, ...parsedAspirantes);
  }
};

// Initialize storage on first load
export const initializeStorage = () => {
  if (!localStorage.getItem('plazas') || !localStorage.getItem('aspirantes')) {
    saveToLocalStorage();
  } else {
    loadFromLocalStorage();
  }
};

// Update aspirante's plaza deseada and handle cascading changes
export const updatePlazaDeseada = (cedula: string, plaza: string): boolean => {
  // Encontrar el aspirante actual
  const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
  if (aspiranteIndex < 0) return false;
  
  const aspirante = aspirantes[aspiranteIndex];
  const antiguaPlaza = aspirante.plazaDeseada;
  
  // Actualizar la plaza del aspirante actual
  aspirantes[aspiranteIndex].plazaDeseada = plaza;
  
  // Si ya existía una selección previa, realizar actualización en cascada
  if (antiguaPlaza !== plaza && plaza !== '') {
    cascadePlazaUpdates(aspirante.puesto, plaza);
  }
  
  saveToLocalStorage();
  return true;
};

// Función para actualizar en cascada las plazas cuando hay conflictos de prioridad
export const cascadePlazaUpdates = (puestoOriginal: number, plazaNueva: string) => {
  // Encontrar todos los aspirantes que tienen la misma plaza y están en puestos inferiores
  const aspirantesAfectados = aspirantes
    .filter(a => a.plazaDeseada === plazaNueva && a.puesto > puestoOriginal)
    .sort((a, b) => a.puesto - b.puesto); // Ordenar por puesto (ascendente)
  
  if (aspirantesAfectados.length === 0) return;
  
  // Encontrar cuántos aspirantes hay seleccionados para la plaza nueva
  const plazaSeleccionada = plazas.find(p => p.municipio === plazaNueva);
  if (!plazaSeleccionada) return;
  
  // Contar cuántos aspirantes con mejor puesto ya seleccionaron esta plaza
  const aspirantesConMejorPuesto = aspirantes.filter(
    a => a.plazaDeseada === plazaNueva && a.puesto <= puestoOriginal
  ).length;
  
  // Si hay más aspirantes con mejor puesto que vacantes, reasignar a los aspirantes afectados
  if (aspirantesConMejorPuesto >= plazaSeleccionada.vacantes) {
    for (const aspiranteAfectado of aspirantesAfectados) {
      // Buscar sus prioridades
      reasignarSiguientePrioridad(aspiranteAfectado);
    }
  }
};

// Función para reasignar a un aspirante a su siguiente plaza prioritaria disponible
export const reasignarSiguientePrioridad = (aspirante: Aspirante): void => {
  // Si el aspirante no tiene plaza asignada, no hacer nada
  if (!aspirante.plazaDeseada) return;
  
  // Buscar las prioridades del aspirante almacenadas en localStorage
  const prioridadesString = localStorage.getItem(`prioridades_${aspirante.cedula}`);
  if (!prioridadesString) {
    // Si no hay prioridades guardadas, simplemente quitar la plaza
    const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
    if (index >= 0) {
      aspirantes[index].plazaDeseada = '';
    }
    return;
  }
  
  // Convertir el string de prioridades a un array
  const prioridades: { municipio: string, prioridad: number }[] = JSON.parse(prioridadesString);
  
  // Ordenar prioridades
  prioridades.sort((a, b) => a.prioridad - b.prioridad);
  
  // Buscar la siguiente plaza disponible según las prioridades
  for (const prioridad of prioridades) {
    const plazaObj = plazas.find(p => p.municipio === prioridad.municipio);
    if (!plazaObj) continue;
    
    // Verificar disponibilidad considerando sólo aspirantes con mejor puesto
    const aspirantesConMejorPuesto = aspirantes.filter(
      a => a.plazaDeseada === prioridad.municipio && a.puesto < aspirante.puesto
    ).length;
    
    if (aspirantesConMejorPuesto < plazaObj.vacantes) {
      // La plaza está disponible, asignarla
      const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
      if (index >= 0) {
        const plazaAnterior = aspirantes[index].plazaDeseada;
        aspirantes[index].plazaDeseada = prioridad.municipio;
        
        // Verificar si este cambio afecta a otros aspirantes
        if (plazaAnterior !== prioridad.municipio) {
          cascadePlazaUpdates(aspirante.puesto, prioridad.municipio);
        }
        
        return;
      }
    }
  }
  
  // Si no se encontró ninguna plaza disponible, quitar la asignación
  const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
  if (index >= 0) {
    aspirantes[index].plazaDeseada = '';
  }
};

// Check if a plaza is available based on aspirante position
export const isPlazaAvailable = (municipio: string, aspirantePuesto: number): boolean => {
  // Find the plaza
  const plaza = plazas.find(p => p.municipio === municipio);
  if (!plaza) return false;
  
  // Count how many aspirantes with better position already selected this plaza
  const selectedCount = aspirantes
    .filter(a => a.plazaDeseada === municipio && a.puesto < aspirantePuesto)
    .length;
  
  // Check if there are still vacancies available
  return selectedCount < plaza.vacantes;
};

// Get available plaza based on priorities
export const getAvailablePlazaByPriority = (
  priorities: { municipio: string, prioridad: number }[],
  aspirantePuesto: number
): string => {
  // Sort priorities by priority number
  const sortedPriorities = [...priorities].sort((a, b) => a.prioridad - b.prioridad);
  
  // Find the first available plaza
  for (const priority of sortedPriorities) {
    if (isPlazaAvailable(priority.municipio, aspirantePuesto)) {
      return priority.municipio;
    }
  }
  
  // If no plaza is available, return empty string
  return "";
};
