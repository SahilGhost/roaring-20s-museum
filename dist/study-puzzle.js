// Six desk slips, authored as historical paraphrases for the museum.
export const STUDY_SLIPS = [
  {id:'study-slip-1',number:1,title:'The Budget',
   text:'Treasury desk memo: Cut income tax rates, protect American producers with tariffs, and restrain spending. Put the money left after expenses toward the debt from the Great War.',
   question:'When the government collects more than it spends, the result is a budget _______.',answer:'SURPLUS',
   context:'Andrew Mellon served as Treasury secretary under both Harding and Coolidge. Their fiscal program combined tax reductions with spending restraint and debt repayment. A balanced budget has equal revenue and spending; a positive balance is money available after expenses. Protective tariffs were another policy choice, with different effects on domestic producers and overseas trade.',
   sources:['harding-policy','coolidge-policy','coolidge-message']},
  {id:'study-slip-2',number:2,title:'The Strike Notice',
   text:'September 1922: At the Attorney General’s request, a federal judge issues an order restricting interference with railroad operations during the shopmen’s strike.',
   question:'What legal tool did the court use to restrict the strike activity?',answer:'INJUNCTION',
   context:'Attorney General Harry Daugherty obtained a temporary restraining order on September 1, 1922. Judge James Wilkerson reissued it with nationwide force later that month. The strike grew out of pay cuts and disputes about work rules and seniority. Federal intervention showed that a business-friendly government could act forcefully in a labor conflict.',
   sources:['rail-strike']},
  {id:'study-slip-3',number:3,title:'The Banker’s Memo',
   text:'Germany needs foreign credit to help meet reparations. The Allies need resources to service wartime debts owed to the United States. Under the 1924 plan, American private credit reaches Germany, reparations reach Britain and France, and Allied debt payments reach the U.S. Treasury.',
   question:'What form of credit did an American private banker extend to Germany? Give the singular noun.',answer:'LOAN',
   context:'The Dawes arrangement adjusted Germany’s reparations schedule and supported stabilization through foreign lending. Reparations and Allied war debts were different obligations, even though payments became linked in practice. American private banks supplied credit; the U.S. government was the creditor for Allied wartime borrowing. The chain depended in part on continued lending and confidence.',
   sources:['dawes','state-dawes']},
  {id:'study-slip-4',number:4,title:'The Speech Program',
   text:'Washington, January 17, 1925: Coolidge addresses newspaper professionals. He says “the chief business of the American people is business,” while also discussing a free press, public service, and ideals beyond wealth.',
   question:'Complete the audience’s organization name: American Society of Newspaper _______.',answer:'EDITORS',
   context:'Coolidge spoke about the press’s responsibility to inform the public and distinguish editorial judgment from business interests. The familiar business sentence came within a much longer argument. He also emphasized peace, honor, charity, and idealism. Reading the whole address gives a fuller picture of his serious, pro-business tone than the famous line alone.',
   sources:['coolidge-editors']},
  {id:'study-slip-5',number:5,title:'The Kerosene Lamp',
   text:'Plymouth Notch, Vermont, August 1923: News arrives that Harding has died. By kerosene lamplight, Coolidge takes the presidential oath in the family home. His father is a local official authorized to certify signatures and administer oaths.',
   question:'What was John Calvin Coolidge Sr.’s title? Supply the six-letter word before “public.”',answer:'NOTARY',
   context:'Harding died on August 2, 1923, while Coolidge was visiting his family in Vermont. Coolidge’s father administered the oath in the early hours of August 3. In his own statement, Coolidge expressed grief and an intention to continue the administration’s policies. The modest setting became a lasting image of orderly succession and his restrained public manner.',
   sources:['coolidge-oath']},
  {id:'study-slip-6',number:6,title:'The Satchel',
   text:'Fall’s oil dealings reach from Wyoming to California. Sinclair’s company receives a Wyoming naval reserve lease without competitive bidding. In a separate transaction linked to Elk Hills in California, Doheny sends Fall $100,000 in a satchel. The Wyoming reserve is named for a nearby rock formation.',
   question:'What everyday object did that Wyoming rock resemble, giving the scandal its name?',answer:'TEAPOT',
   context:'Teapot Dome in Wyoming and Elk Hills in California involved different leases and businessmen. Investigators traced personal benefits to Albert Fall and challenged the use of public resources for private gain. Fall was convicted of accepting a bribe in 1929. Congressional oversight and legal action were crucial to exposing the wrongdoing.',
   sources:['teapot-history','teapot-oversight','teapot-court']}
];
export const STUDY_DRAWER = {
 title:'The Desk of Silent Cal',code:'SILENT',
 intro:'It is 1929. Coolidge has left the White House, but a drawer in his desk is still locked. Six numbered slips lie on the desk, each connected to a topic from his years in government. Solve the slips, keep their order, and find the six-letter word that opens the drawer.',
 prompt:'Enter the six-letter drawer word.',
 hints:['The six slips belong to one sequence.','Review your completed answers together in their numbered order.','The drawer word should fit the president whose desk you are examining.'],
 note:'Coolidge was famous for saying little.',
 debrief:['Which slips show the government siding with business over labor?','How did the circle of money in the banker’s memo leave recovery vulnerable when American lending weakened?','How did Coolidge’s quiet style help restore confidence after the Harding scandals?']
};
export const normalizeSlipAnswer = value => String(value??'').trim().toUpperCase();
