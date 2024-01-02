function HideContent(d) {
document.getElementById(d).style.display = "none";
}
function ShowContent(d) {
document.getElementById(d).style.display = "block";
}
function ReverseDisplay(d) {
if(document.getElementById(d).style.display == "none") { document.getElementById(d).style.display = "block"; }
else { document.getElementById(d).style.display = "none"; }
}

/*
樣式一︰
<a href="javascript:ShowContent('uniquename')">
點擊此顯示內容
</a>
樣式二︰
<a href="javascript:HideContent('uniquename')">
點擊此隱藏內容
</a>
樣式三︰
<a href="javascript:ReverseDisplay('uniquename')">
點擊此顯示/隱藏內容
</a>
內容︰
<div id="uniquename" style="display:none;">
要隱藏/顯示的內容放在這裡
</div>
*/