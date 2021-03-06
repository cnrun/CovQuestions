import { Questionnaire } from "covquestions-js/models/Questionnaire.generated";

const testQuestionnaire: Questionnaire = {
  id: "aa43ae11-2b3c-46dd-ac01-c901c3d36a3e",
  schemaVersion: "1",
  version: 1,
  language: "de",
  title: "Example",
  meta: {
    author: "Alexander",
    availableLanguages: ["de"],
    creationDate: "2020-04-10T18:48:48+0000",
  },
  questions: [
    {
      id: "q_contact",
      text: "Gab es Kontakt zu bestätigten Fällen?",
      type: "boolean",
    },
    {
      id: "q_contact_when",
      text: "Wann trat der Kontakt auf?",
      type: "date",
      enableWhenExpression: {
        var: "q_contact.value",
      },
    },
    {
      id: "q_symptoms",
      text: "Symptome?",
      type: "multiselect",
      options: [
        {
          text: "Husten",
          value: "cough",
        },
        {
          text: "Fieber",
          value: "fever",
        },
        {
          text: "Atembeschwerden",
          value: "respiratory",
        },
      ],
    },
    {
      id: "q_symptoms_when",
      text: "Ab wann gab es Symptome?",
      type: "date",
      enableWhenExpression: {
        var: "q_symptoms.value",
      },
    },
    {
      id: "q_risk_factors",
      text: "Gibt es Risikofaktoren?",
      type: "boolean",
    },
    {
      id: "q_chronic_afflictions",
      text: "Gibt es Chronische Beschwerden?",
      type: "boolean",
    },
    {
      id: "q_medical_staff",
      text: "Medizinisches Personal?",
      type: "boolean",
      enableWhenExpression: {
        in: [
          {
            var: "v_risk.value",
          },
          ["HIGH_RISK", "MEDIUM_RISK_A", "MEDIUM_RISK_B"],
        ],
      },
    },
  ],
  variables: [
    {
      id: "v_contact_relevant",
      expression: {
        "<=": [
          {
            "-": [
              {
                var: "g_now.value",
              },
              {
                var: "q_contact_when.value",
              },
            ],
          },
          1209600,
        ],
      },
    },
    {
      id: "v_symptoms_relevant",
      expression: {
        ">=": [
          {
            var: "q_symptoms.count",
          },
          1,
        ],
      },
    },
    {
      id: "v_risk",
      expression: {
        if: [
          {
            var: "q_contact.value",
          },
          {
            if: [
              {
                var: "v_symptoms_relevant",
              },
              {
                if: [
                  {
                    and: [
                      {
                        "<=": [
                          {
                            "-": [
                              {
                                var: "q_contact_when.value",
                              },
                              {
                                var: "q_symptoms_when.value",
                              },
                            ],
                          },
                          1209600,
                        ],
                      },
                      {
                        ">=": [
                          {
                            "-": [
                              {
                                var: "q_contact_when.value",
                              },
                              {
                                var: "q_symptoms_when.value",
                              },
                            ],
                          },
                          0,
                        ],
                      },
                    ],
                  },
                  "HIGH_RISK",
                  {
                    if: [
                      {
                        and: [
                          {
                            in: [
                              {
                                var: "q_symptoms.value",
                              },
                              ["respiratory"],
                            ],
                          },
                          {
                            or: [
                              {
                                var: "q_risk_factors.value",
                              },
                              {
                                var: "q_chronic_afflictions.value",
                              },
                            ],
                          },
                        ],
                      },
                      "MEDIUM_RISK_A",
                      "MISSING",
                    ],
                  },
                ],
              },
              {
                if: [
                  {
                    var: "v_contact_relevant",
                  },
                  "MEDIUM_RISK_B",
                  "NO_RISK",
                ],
              },
            ],
          },
          {
            if: [
              {
                var: "v_symptoms_relevant",
              },
              {
                if: [
                  {
                    in: [
                      {
                        var: "q_symptoms.value",
                      },
                      ["respiratory"],
                    ],
                  },
                  "MEDIUM_RISK_B",
                  "NO_RISK",
                ],
              },
              "MISSING",
            ],
          },
        ],
      },
    },
  ],
  resultCategories: [
    {
      id: "rc_risk",
      description: "Risikoeinschätzung",
      results: [
        {
          id: "MEDIUM_RISK_A",
          text: "Mittleres Risiko",
          expression: {
            "==": [
              {
                var: "v_risk.value",
              },
              "MEDIUM_RISK_A",
            ],
          },
        },
        {
          id: "MEDIUM_RISK_B",
          text: "Mittleres Risiko",
          expression: {
            "==": [
              {
                var: "v_risk.value",
              },
              "MEDIUM_RISK_B",
            ],
          },
        },
        {
          id: "HIGH_RISK",
          text: "Hohes Risiko",
          expression: {
            "==": [
              {
                var: "v_risk.value",
              },
              "HIGH_RISK",
            ],
          },
        },
        {
          id: "NO_RISK",
          text: "Kein Risiko",
          expression: {
            "==": [
              {
                var: "v_risk.value",
              },
              "NO_RISK",
            ],
          },
        },
      ],
    },
    {
      id: "rc_medical_advisory",
      description: "Medizinischer Leitfaden",
      results: [
        {
          id: "SHOW_MEDICAL_ADVISORY",
          text: "Hilfreiche Information.",
          expression: {
            var: "q_medical_staff.value",
          },
        },
      ],
    },
    {
      id: "rc_contact_irrelevant",
      description: "Kontakt",
      results: [
        {
          id: "SHOW_CONTACT_IRRELEVANT_ADVISORY",
          text: "Der Kontakt war irrellevant.",
          expression: {
            and: [
              {
                var: "q_contact.value",
              },
              {
                "!": {
                  var: "v_contact_relevant.value",
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

export default testQuestionnaire;
