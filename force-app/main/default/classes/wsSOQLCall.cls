public with sharing class wsSOQLCall {
    @AuraEnabled(cacheable=false)
    public static String getAggregateValue(String soqlQuery){
        List<SObject> result = Database.query(soqlQuery);
        try {
            return String.valueOf(result.get(0).get('expr0')); 
        } catch (Exception e) {
            return null;  
        }
    } 
    
    @AuraEnabled(cacheable=true)
    public static String getAggregateValue2(String soqlQuery, String option){
        List<SObject> result = Database.query(soqlQuery);
        try {
            if(option=='Size'){
                return String.valueOf(result.size());
            }
            return String.valueOf(result.get(0).get('expr0')); 
        } catch (Exception e) {
            return null;  
        }
    } 

    @AuraEnabled(cacheable=true)
    public static List<sObject> getObjects(String soqlQuery){
        system.debug(Database.query(soqlQuery));
        return Database.query(soqlQuery);
        
    }

    @AuraEnabled(cacheable=false)
    public static sObject getObject(String soqlQuery){
        List<sObject> results = Database.query(soqlQuery);
        if(results.size() > 0){
    		return results[0];
    	}else{
    		return null;
    	}
    }

   //@InvocableMethod
   public static List<Double> groupBy(List<flowInputs> inputs) {
    List<Double> listOfGroupedValues = new List<Double>();
      for(flowInputs singleInput: inputs){
        //faire un test pour voir si la where clause est vide ou non
        String query = 'SELECT SUM(' + singleInput.FieldToGroupBy +')result from ' + singleInput.ObjectApiName + ' where ' + singleInput.WhereClause ;
        system.debug('###### DEBUG query' + query );
        String AggregateValue = getAggregateValue(query);
        Decimal groupedValue = 0;
        if(AggregateValue!=null){
            groupedValue = decimal.valueOf(getAggregateValue(query));
        }
        system.debug('###### DEBUG groupedvalue:' + groupedValue);
        listOfGroupedValues.add(groupedValue);
      }
      return listOfGroupedValues;
   }

   Public class flowInputs{
      @InvocableVariable
      public String FieldToGroupBy;

      @InvocableVariable
      public String ObjectApiName;
      
      @InvocableVariable
      public String WhereClause;

   }
}