using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using JsonLogic.Net;
using Newtonsoft.Json.Linq;

namespace Validator
{
    class Program
    {
        public static JToken JsonFrom(string input)
        {
            return JToken.Parse(input.Replace('`', '"'));
        }
        private object GetDataObject(JToken token)
        {
            if (token is JValue) return CastPrimitive((token as JValue).Value);
            if (token is JArray) return (token as JArray).Select(t => GetDataObject(t)).ToArray();
            if (token is JObject)
                return (token as JObject).Properties().Aggregate(new Dictionary<string, object>(), (d, p) =>
                {
                    d.Add(p.Name, GetDataObject(p.Value));
                    return d;
                });
            throw new Exception("GetDataObject cannot handle token " + token.ToString());
        }
        private object CastPrimitive(object value)
        {
            if (value is int || value is short || value is long || value is double || value is float || value is decimal
            ) return Convert.ToDouble(value);
            return value;
        }
        private void Analyze(string ruleJson, string dataJson)
        {
            var rule = JsonFrom(ruleJson);
            var data = GetDataObject(JsonFrom(dataJson));
            var evaluator = new JsonLogicEvaluator(EvaluateOperators.Default);
            var result = evaluator.Apply(rule, data);
            Console.WriteLine($"-->{result}");

        }
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            string ruleJson="";
            string dataJson="null";
            try{
                ruleJson = System.IO.File.ReadAllText("../../../json-logic/example.json");
                Console.WriteLine($"Read {ruleJson.Count()}");
                new Program().Analyze(ruleJson, dataJson);
            }
            catch
            {
                Console.WriteLine("Can't parse");
                Console.WriteLine($"{ruleJson}");
            }
        }
    }
}
